import { createPublicClient, http, encodeFunctionData, toHex, type PublicClient } from 'viem';
import { ADDRESSES, CHAIN_ID, DEFAULT_RPC_URL } from './deployment';
import { SqueekCoreAbi, SqueekMiningAbi, SqueekTokenAbi, SqueekNFTAbi } from './generated/abis';
import { verifyDeployment, assertCanonical, type Snapshot } from './verify';
import { address, claimIds, tokenId } from './utils';
import { evaluateMerge } from './merge';
import { SqueekKitError } from './errors';

export interface ChainOptions {
  rpcUrl?: string;
  publicClient?: PublicClient;
  confirmations?: number;
}
export class SqueekChain {
  readonly client: PublicClient;
  readonly confirmations: number;
  constructor(options: ChainOptions = {}) {
    this.confirmations = options.confirmations ?? 12;
    this.client =
      options.publicClient ??
      createPublicClient({
        transport: http(options.rpcUrl ?? DEFAULT_RPC_URL, {
          batch: { batchSize: 25, wait: 10 },
          timeout: 15000,
          retryCount: 1,
        }),
      });
  }
  verify(options: { blockNumber?: bigint; confirmations?: number } = {}) {
    return verifyDeployment(this.client, { confirmations: this.confirmations, ...options });
  }
  async protocol(options: { blockNumber?: bigint } = {}) {
    const snapshot = await this.verify(options);
    return this.readProtocol(snapshot);
  }
  /** Diagnostic read: identity/ABI checks remain mandatory; changed configuration is explicit. Never used by prepare methods. */
  async auditProtocol() {
    const snapshot = await verifyDeployment(this.client, {
      confirmations: this.confirmations,
      observeConfigurationDrift: true,
    });
    return this.readProtocol(snapshot);
  }
  private async readProtocol(snapshot: Snapshot) {
    const blockNumber = snapshot.blockNumber;
    const [core, mining, checkpoint, supply, rewardPerBlock, nftSupply] = await Promise.all([
      this.client.readContract({
        address: ADDRESSES.core,
        abi: SqueekCoreAbi,
        functionName: 'state',
        blockNumber,
      }),
      this.client.readContract({
        address: ADDRESSES.mining,
        abi: SqueekMiningAbi,
        functionName: 'state',
        blockNumber,
      }),
      this.client.readContract({
        address: ADDRESSES.mining,
        abi: SqueekMiningAbi,
        functionName: 'checkpointStatus',
        blockNumber,
      }),
      this.client.readContract({
        address: ADDRESSES.token,
        abi: SqueekTokenAbi,
        functionName: 'totalSupply',
        blockNumber,
      }),
      this.client.readContract({
        address: ADDRESSES.mining,
        abi: SqueekMiningAbi,
        functionName: 'REWARD_PER_BLOCK',
        blockNumber,
      }),
      this.client.readContract({
        address: ADDRESSES.nft,
        abi: SqueekNFTAbi,
        functionName: 'totalSupply',
        blockNumber,
      }),
    ]);
    await assertCanonical(this.client, snapshot);
    return {
      snapshot,
      core,
      mining,
      supply,
      rewardPerBlock,
      nftSupply,
      checkpoint: {
        corePaused: checkpoint[0],
        nextRound: checkpoint[1],
        roundSettled: checkpoint[2],
      },
      unprocessedRounds:
        core.settledThroughRound > mining.processedThroughRound
          ? core.settledThroughRound - mining.processedThroughRound
          : 0n,
    };
  }
  private async ownership(owner: string, ids: bigint[], snapshot: Snapshot) {
    const expected = address(owner);
    const owners = await Promise.all(
      ids.map((id) =>
        this.client.readContract({
          address: ADDRESSES.nft,
          abi: SqueekNFTAbi,
          functionName: 'ownerOf',
          args: [id],
          blockNumber: snapshot.blockNumber,
        }),
      ),
    );
    owners.forEach((actual, i) => {
      if (actual.toLowerCase() !== expected.toLowerCase())
        throw new SqueekKitError(
          'NOT_OWNER',
          `The supplied wallet does not own Squeek #${ids[i]}.`,
          { tokenId: ids[i]?.toString(), expected, actual },
        );
    });
    return expected;
  }
  async inspectSqueeks(owner: string, values: readonly (bigint | string)[]) {
    const ids = claimIds(values);
    address(owner);
    const snapshot = await this.verify();
    const checkedOwner = await this.ownership(owner, ids, snapshot);
    const positions = await Promise.all(
      ids.map(async (id) => {
        const [position, claimable] = await Promise.all([
          this.client.readContract({
            address: ADDRESSES.mining,
            abi: SqueekMiningAbi,
            functionName: 'position',
            args: [0, id],
            blockNumber: snapshot.blockNumber,
          }),
          this.client.readContract({
            address: ADDRESSES.mining,
            abi: SqueekMiningAbi,
            functionName: 'claimable',
            args: [0, [id]],
            blockNumber: snapshot.blockNumber,
          }),
        ]);
        return { tokenId: id, ...position, claimableBaseUnits: claimable };
      }),
    );
    // A batch can pay slightly more than the sum of separately rounded per-NFT amounts.
    const batchClaimableBaseUnits = await this.client.readContract({
      address: ADDRESSES.mining,
      abi: SqueekMiningAbi,
      functionName: 'claimable',
      args: [0, ids],
      blockNumber: snapshot.blockNumber,
    });
    await assertCanonical(this.client, snapshot);
    return { snapshot, owner: checkedOwner, positions, batchClaimableBaseUnits };
  }
  private async mergeAt(owner: string, survivorId: bigint, donorId: bigint, snapshot: Snapshot) {
    await this.ownership(owner, [survivorId, donorId], snapshot);
    const args = {
      address: ADDRESSES.mining,
      abi: SqueekMiningAbi,
      blockNumber: snapshot.blockNumber,
    } as const;
    const [survivor, donor, core, policy] = await Promise.all([
      this.client.readContract({ ...args, functionName: 'position', args: [0, survivorId] }),
      this.client.readContract({ ...args, functionName: 'position', args: [0, donorId] }),
      this.client.readContract({
        address: ADDRESSES.core,
        abi: SqueekCoreAbi,
        functionName: 'state',
        blockNumber: snapshot.blockNumber,
      }),
      this.client.readContract({ ...args, functionName: 'collectionPolicy', args: [0] }),
    ]);
    return evaluateMerge({
      survivorId,
      donorId,
      survivor,
      donor,
      height: core.blockHeight,
      maximumLevel: policy.maximumLevel,
    });
  }
  async checkMerge(owner: string, survivor: string | bigint, donor: string | bigint) {
    address(owner);
    const survivorId = tokenId(survivor),
      donorId = tokenId(donor);
    const snapshot = await this.verify();
    const result = await this.mergeAt(owner, survivorId, donorId, snapshot);
    await assertCanonical(this.client, snapshot);
    return { snapshot, ...result };
  }
  private async finishPreparation(snapshot: Snapshot) {
    await assertCanonical(this.client, snapshot);
    const tip = await this.client.getBlockNumber({ cacheTime: 0 });
    if (
      tip < snapshot.blockNumber ||
      tip - snapshot.blockNumber > 5n ||
      BigInt(Math.floor(Date.now() / 1000)) - snapshot.timestamp > 180n
    ) {
      throw new SqueekKitError(
        'STALE_SNAPSHOT',
        'Preparation took too long or the provider is stale. Prepare again before signing.',
      );
    }
  }
  async prepareClaim(owner: string, values: readonly (bigint | string)[]) {
    const from = address(owner),
      ids = claimIds(values);
    const snapshot = await this.verify({ confirmations: 0 });
    await this.ownership(from, ids, snapshot);
    let payout: bigint;
    try {
      const simulation = await this.client.simulateContract({
        address: ADDRESSES.mining,
        abi: SqueekMiningAbi,
        functionName: 'claim',
        args: [0, ids],
        account: from,
        blockNumber: snapshot.blockNumber,
      });
      payout = simulation.result;
    } catch {
      throw new SqueekKitError(
        'SIMULATION_FAILED',
        'Claim simulation failed. Re-read ownership and funded rewards; no transaction was sent.',
      );
    }
    await this.finishPreparation(snapshot);
    const data = encodeFunctionData({
      abi: SqueekMiningAbi,
      functionName: 'claim',
      args: [0, ids],
    });
    return {
      snapshot,
      action: 'claim',
      tokenIds: ids,
      simulatedPayoutBaseUnits: payout,
      needsWalletSignature: true,
      notice: 'Unsigned simulation only. Re-prepare immediately before signing; state can change.',
      bundle: {
        version: '2.0.0',
        chainId: toHex(CHAIN_ID),
        from,
        atomicRequired: true,
        calls: [{ to: ADDRESSES.mining, data, value: '0x0' }],
      },
    };
  }
  async prepareMerge(owner: string, survivor: string | bigint, donor: string | bigint) {
    const from = address(owner),
      survivorId = tokenId(survivor),
      donorId = tokenId(donor);
    const snapshot = await this.verify({ confirmations: 0 });
    const eligibility = await this.mergeAt(from, survivorId, donorId, snapshot);
    if (!eligibility.eligible)
      throw new SqueekKitError('NOT_MERGEABLE', 'These Squeeks cannot merge.', {
        reasons: eligibility.reasons,
      });
    try {
      await this.client.simulateContract({
        address: ADDRESSES.mining,
        abi: SqueekMiningAbi,
        functionName: 'merge',
        args: [0, survivorId, donorId],
        account: from,
        blockNumber: snapshot.blockNumber,
      });
    } catch {
      throw new SqueekKitError(
        'SIMULATION_FAILED',
        'Merge simulation failed. Re-read eligibility; no transaction was sent.',
      );
    }
    await this.finishPreparation(snapshot);
    const data = encodeFunctionData({
      abi: SqueekMiningAbi,
      functionName: 'merge',
      args: [0, survivorId, donorId],
    });
    return {
      snapshot,
      action: 'merge',
      ...eligibility,
      needsWalletSignature: true,
      notice:
        'Show the permanent burn to the owner and obtain confirmation in the wallet. Re-prepare immediately before signing.',
      bundle: {
        version: '2.0.0',
        chainId: toHex(CHAIN_ID),
        from,
        atomicRequired: true,
        calls: [{ to: ADDRESSES.mining, data, value: '0x0' }],
      },
    };
  }
}
