import {
  createPublicClient,
  http,
  parseAbi,
  keccak256,
  getAddress,
  encodeFunctionData,
  toHex,
  type Hex,
  type Address,
  type PublicClient,
  type Abi,
} from 'viem';
import { CURRENT_TESTNET as profile, CURRENT_ADDRESSES as A } from './current-profile';
import { DEFAULT_RPC_URL } from './deployment';
import {
  CurrentCoreAbi as coreAbi,
  CurrentMiningAbi as miningAbi,
  CurrentStakingAbi as stakingAbi,
  CurrentNftAbi as nftAbi,
  CurrentTokenAbi as tokenAbi,
} from './generated/current/abis';
import { address, claimIds, tokenId } from './utils';
import { SqueekKitError, requireInput } from './errors';
import { assertCanonical, type Snapshot } from './verify';
import type { ChainOptions } from './chain';

const implSlot = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';
const adminSlot = '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103';
const identityAbi = parseAbi([
  'function owner() view returns(address)',
  'function implementationCodeAddress() view returns(address)',
  'function implementationCodeVersion() view returns(uint64)',
  'function implementationStorageLayoutDigest() view returns(bytes32)',
]);
const linkAbi = parseAbi([
  'function core() view returns(address)',
  'function staking() view returns(address)',
  'function genesis() view returns(address)',
  'function mining() view returns(address)',
  'function launch() view returns(address)',
  'function clones() view returns(address)',
  'function sqkCore() view returns(address)',
  'function governance() view returns(address)',
  'function protocolRecipient() view returns(address)',
]);
export interface CurrentSnapshot extends Snapshot {
  profileId: string;
  verificationBasis: 'observed-official-app';
}
function equal(actual: unknown, expected: unknown, field: string) {
  if (String(actual).toLowerCase() !== String(expected).toLowerCase())
    throw new SqueekKitError('DEPLOYMENT_MISMATCH', `Current testnet check failed: ${field}.`, {
      field,
      expected,
      actual,
    });
}
function slot(value: Hex | undefined) {
  if (!value || !/^0x[\da-f]{64}$/i.test(value))
    throw new SqueekKitError('DEPLOYMENT_MISMATCH', 'Missing proxy identity.');
  return getAddress('0x' + value.slice(-40));
}
/** Genesis NFTs and account rewards for the separately pinned current Sepolia app. No signing/broadcasting. */
export class CurrentTestnetChain {
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
  async verify(
    options: { blockNumber?: bigint; confirmations?: number } = {},
  ): Promise<CurrentSnapshot> {
    const confirmations = options.confirmations ?? this.confirmations;
    requireInput(
      Number.isInteger(confirmations) && confirmations >= 0 && confirmations <= 256,
      'Invalid confirmation count.',
    );
    const chainId = await this.client.getChainId();
    if (chainId !== 11155111)
      throw new SqueekKitError('WRONG_CHAIN', 'The current-app profile supports Sepolia only.');
    const tip = await this.client.getBlockNumber({ cacheTime: 0 });
    const bn = options.blockNumber ?? tip - BigInt(confirmations);
    requireInput(
      bn >= BigInt(profile.deploymentBlock) && bn <= tip,
      'Snapshot must be within this deployment.',
    );
    const block = await this.client.getBlock({ blockNumber: bn });
    if (!block.hash) throw new SqueekKitError('RPC_ERROR', 'Snapshot needs a block hash.');
    const snapshot: CurrentSnapshot = {
      profileId: profile.id,
      verificationBasis: 'observed-official-app',
      chainId,
      release: profile.release.id,
      blockNumber: bn,
      blockHash: block.hash,
      timestamp: block.timestamp,
      verified: true,
      configurationDrift: [],
    };
    await Promise.all(
      Object.entries(profile.contracts).map(async ([name, record]) => {
        const target = getAddress(record.address),
          code = await this.client.getCode({ address: target, blockNumber: bn });
        equal(
          code && code !== '0x' ? keccak256(code) : null,
          record.runtimeHash,
          name + '.runtimeHash',
        );
        if ('implementation' in record) {
          const [implementation, admin] = await Promise.all([
            this.client.getStorageAt({ address: target, slot: implSlot, blockNumber: bn }),
            this.client.getStorageAt({ address: target, slot: adminSlot, blockNumber: bn }),
          ]);
          equal(slot(implementation), record.implementation, name + '.implementation');
          equal(slot(admin), record.proxyAdmin, name + '.proxyAdmin');
          const [implCode, adminCode, owner, reported, version, layout] = await Promise.all([
            this.client.getCode({ address: getAddress(record.implementation), blockNumber: bn }),
            this.client.getCode({ address: getAddress(record.proxyAdmin), blockNumber: bn }),
            this.client.readContract({
              address: getAddress(record.proxyAdmin),
              abi: identityAbi,
              functionName: 'owner',
              blockNumber: bn,
            }),
            this.client.readContract({
              address: target,
              abi: identityAbi,
              functionName: 'implementationCodeAddress',
              blockNumber: bn,
            }),
            this.client.readContract({
              address: target,
              abi: identityAbi,
              functionName: 'implementationCodeVersion',
              blockNumber: bn,
            }),
            this.client.readContract({
              address: target,
              abi: identityAbi,
              functionName: 'implementationStorageLayoutDigest',
              blockNumber: bn,
            }),
          ]);
          equal(
            implCode ? keccak256(implCode) : null,
            record.implementationRuntimeHash,
            name + '.implementationHash',
          );
          equal(
            adminCode ? keccak256(adminCode) : null,
            record.proxyAdminRuntimeHash,
            name + '.adminHash',
          );
          equal(owner, record.proxyAdminOwner, name + '.governance');
          equal(reported, record.implementation, name + '.reportedImplementation');
          equal(version, record.version, name + '.version');
          equal(layout, record.layout, name + '.layout');
        }
      }),
    );
    await Promise.all(
      Object.entries(profile.links).map(async ([field, expected]) => {
        const [key, fn] = field.split('.') as [keyof typeof A, (typeof linkAbi)[number]['name']];
        equal(
          await this.client.readContract({
            address: A[key],
            abi: linkAbi,
            functionName: fn,
            blockNumber: bn,
          }),
          expected,
          field,
        );
      }),
    );
    const [core, mining, max, decimals] = await Promise.all([
      this.client.readContract({
        address: A.core,
        abi: coreAbi,
        functionName: 'configuration',
        blockNumber: bn,
      }),
      this.client.readContract({
        address: A.mining,
        abi: miningAbi,
        functionName: 'configuration',
        blockNumber: bn,
      }),
      this.client.readContract({
        address: A.nft,
        abi: nftAbi,
        functionName: 'MAXIMUM_LEVEL',
        blockNumber: bn,
      }),
      this.client.readContract({
        address: A.token,
        abi: tokenAbi,
        functionName: 'decimals',
        blockNumber: bn,
      }),
    ]);
    for (const [key, value] of Object.entries(profile.configuration.core))
      equal(core[key as keyof typeof core], value, 'core.configuration.' + key);
    for (const [key, value] of Object.entries(profile.configuration.mining))
      equal(mining[key as keyof typeof mining], value, 'mining.configuration.' + key);
    equal(max, profile.configuration.maximumLevel, 'maximumLevel');
    equal(decimals, profile.configuration.decimals, 'decimals');
    await assertCanonical(this.client, snapshot);
    return snapshot;
  }
  async protocol() {
    const snapshot = await this.verify(),
      blockNumber = snapshot.blockNumber;
    const [core, mining, supply] = await Promise.all([
      this.client.readContract({
        address: A.core,
        abi: coreAbi,
        functionName: 'state',
        blockNumber,
      }),
      this.client.readContract({
        address: A.mining,
        abi: miningAbi,
        functionName: 'state',
        blockNumber,
      }),
      this.client.readContract({
        address: A.token,
        abi: tokenAbi,
        functionName: 'totalSupply',
        blockNumber,
      }),
    ]);
    await assertCanonical(this.client, snapshot);
    return { snapshot, core, mining, supply };
  }
  private async accountAt(owner: Address, snapshot: CurrentSnapshot) {
    const blockNumber = snapshot.blockNumber;
    const [
      account,
      power,
      claimableBaseUnits,
      claimRecipient,
      stake,
      sqkBalanceBaseUnits,
      walletNfts,
    ] = await Promise.all([
      this.client.readContract({
        address: A.mining,
        abi: miningAbi,
        functionName: 'account',
        args: [owner],
        blockNumber,
      }),
      this.client.readContract({
        address: A.mining,
        abi: miningAbi,
        functionName: 'accountPower',
        args: [owner],
        blockNumber,
      }),
      this.client.readContract({
        address: A.mining,
        abi: miningAbi,
        functionName: 'claimable',
        args: [owner],
        blockNumber,
      }),
      this.client.readContract({
        address: A.mining,
        abi: miningAbi,
        functionName: 'claimRecipient',
        args: [owner],
        blockNumber,
      }),
      this.client.readContract({
        address: A.staking,
        abi: stakingAbi,
        functionName: 'stakeOf',
        args: [owner],
        blockNumber,
      }),
      this.client.readContract({
        address: A.token,
        abi: tokenAbi,
        functionName: 'balanceOf',
        args: [owner],
        blockNumber,
      }),
      this.client.readContract({
        address: A.nft,
        abi: nftAbi,
        functionName: 'balanceOf',
        args: [owner],
        blockNumber,
      }),
    ]);
    return {
      owner,
      account,
      power: { nft: power[0], sqk: power[1], effectiveRound: power[2] },
      claimableBaseUnits,
      claimRecipient,
      stake: { principalBaseUnits: stake[0], freshBaseUnits: stake[1], freshUntilRound: stake[2] },
      sqkBalanceBaseUnits,
      walletNfts,
    };
  }
  async account(owner: string) {
    const from = address(owner),
      snapshot = await this.verify();
    const account = await this.accountAt(from, snapshot);
    await assertCanonical(this.client, snapshot);
    return { snapshot, ...account };
  }
  private async tokenAt(owner: Address, id: bigint, snapshot: CurrentSnapshot) {
    const blockNumber = snapshot.blockNumber;
    const [actualOwner, depositor, level, nextMergeHeight] = await Promise.all([
      this.client.readContract({
        address: A.nft,
        abi: nftAbi,
        functionName: 'ownerOf',
        args: [id],
        blockNumber,
      }),
      this.client.readContract({
        address: A.staking,
        abi: stakingAbi,
        functionName: 'depositor',
        args: [A.nft, id],
        blockNumber,
      }),
      this.client.readContract({
        address: A.nft,
        abi: nftAbi,
        functionName: 'level',
        args: [id],
        blockNumber,
      }),
      this.client.readContract({
        address: A.nft,
        abi: nftAbi,
        functionName: 'nextMergeHeight',
        args: [id],
        blockNumber,
      }),
    ]);
    const custody =
      actualOwner.toLowerCase() === owner.toLowerCase()
        ? 'wallet'
        : actualOwner.toLowerCase() === A.staking.toLowerCase() &&
            depositor.toLowerCase() === owner.toLowerCase()
          ? 'staking'
          : null;
    if (!custody)
      throw new SqueekKitError(
        'NOT_OWNER',
        `Wallet does not own or have a deposit of Squeek #${id}.`,
        { tokenId: id.toString(), actualOwner, depositor },
      );
    return { tokenId: id, actualOwner, depositor, custody, level, nextMergeHeight };
  }
  async inspectSqueeks(owner: string, values: readonly (string | bigint)[]) {
    const from = address(owner),
      ids = claimIds(values),
      snapshot = await this.verify();
    const tokens = await Promise.all(ids.map((id) => this.tokenAt(from, id, snapshot)));
    await assertCanonical(this.client, snapshot);
    return { snapshot, owner: from, tokens };
  }
  private async mergeAt(
    owner: Address,
    survivor: bigint,
    donor: bigint,
    snapshot: CurrentSnapshot,
  ) {
    const [a, b, core] = await Promise.all([
      this.tokenAt(owner, survivor, snapshot),
      this.tokenAt(owner, donor, snapshot),
      this.client.readContract({
        address: A.core,
        abi: coreAbi,
        functionName: 'state',
        blockNumber: snapshot.blockNumber,
      }),
    ]);
    const reasons: string[] = [];
    if (survivor === donor) reasons.push('Survivor and donor must be different.');
    if (a.custody !== b.custody)
      reasons.push('Both NFTs must be in the wallet or both deposited by this account.');
    if (a.level !== b.level) reasons.push('Both NFTs must have the same level.');
    if (a.level >= profile.configuration.maximumLevel)
      reasons.push('The maximum level cannot merge.');
    if (a.nextMergeHeight > core.blockHeight || b.nextMergeHeight > core.blockHeight)
      reasons.push('The completed Squeek-block cooldown has not finished.');
    return {
      eligible: reasons.length === 0,
      reasons,
      survivorId: survivor,
      donorId: donor,
      custody: a.custody,
      nextLevel: a.level + 1,
      height: core.blockHeight,
      warning: `Squeek #${donor} would be burned permanently; #${survivor} survives. Rewards belong to the account in this deployment. Eligibility still requires successful simulation.`,
    };
  }
  async checkMerge(owner: string, survivor: string | bigint, donor: string | bigint) {
    const from = address(owner),
      a = tokenId(survivor),
      b = tokenId(donor),
      snapshot = await this.verify();
    const result = await this.mergeAt(from, a, b, snapshot);
    await assertCanonical(this.client, snapshot);
    return { snapshot, ...result };
  }
  private async prepare(
    snapshot: CurrentSnapshot,
    from: Address,
    to: Address,
    abi: Abi,
    functionName: string,
    args: readonly unknown[],
  ) {
    let simulated: unknown;
    try {
      simulated = (
        await this.client.simulateContract({
          address: to,
          abi,
          functionName,
          args,
          account: from,
          blockNumber: snapshot.blockNumber,
        })
      ).result;
    } catch {
      throw new SqueekKitError(
        'SIMULATION_FAILED',
        'The current testnet action reverted in simulation. No transaction was sent.',
      );
    }
    await assertCanonical(this.client, snapshot);
    const tip = await this.client.getBlockNumber({ cacheTime: 0 });
    if (
      tip < snapshot.blockNumber ||
      tip - snapshot.blockNumber > 5n ||
      BigInt(Math.floor(Date.now() / 1000)) - snapshot.timestamp > 180n
    )
      throw new SqueekKitError(
        'STALE_SNAPSHOT',
        'Prepare again from a fresh canonical block before signing.',
      );
    return {
      snapshot,
      simulated: simulated ?? null,
      needsWalletSignature: true,
      notice:
        'Simulation only; no transaction sent. Re-prepare immediately before the owner signs.',
      bundle: {
        version: '2.0.0',
        chainId: toHex(profile.chainId),
        from,
        atomicRequired: true,
        calls: [{ to, data: encodeFunctionData({ abi, functionName, args }), value: '0x0' }],
      },
    };
  }
  async prepareClaim(owner: string) {
    const from = address(owner),
      snapshot = await this.verify({ confirmations: 0 }),
      account = await this.accountAt(from, snapshot);
    const result = await this.prepare(snapshot, from, A.mining, miningAbi, 'claim', [from]);
    return {
      ...result,
      action: 'account-claim',
      recipient: account.claimRecipient,
      accountSettlementComplete: account.account.complete,
      simulatedPayoutBaseUnits: result.simulated,
    };
  }
  async prepareDeposit(owner: string, values: readonly (string | bigint)[]) {
    const from = address(owner),
      ids = claimIds(values),
      snapshot = await this.verify({ confirmations: 0 });
    const allApproved = await this.client.readContract({
      address: A.nft,
      abi: nftAbi,
      functionName: 'isApprovedForAll',
      args: [from, A.staking],
      blockNumber: snapshot.blockNumber,
    });
    for (const id of ids) {
      const token = await this.tokenAt(from, id, snapshot);
      requireInput(token.custody === 'wallet', `Squeek #${id} is already deposited.`);
      const approved =
        allApproved ||
        (
          await this.client.readContract({
            address: A.nft,
            abi: nftAbi,
            functionName: 'getApproved',
            args: [id],
            blockNumber: snapshot.blockNumber,
          })
        ).toLowerCase() === A.staking.toLowerCase();
      if (!approved)
        throw new SqueekKitError(
          'APPROVAL_REQUIRED',
          `Approve Squeek #${id} for the pinned staking contract in your wallet first. No approval was sent.`,
          { tokenId: id.toString(), spender: A.staking },
        );
    }
    return {
      ...(await this.prepare(snapshot, from, A.staking, stakingAbi, 'deposit', [A.nft, ids])),
      action: 'nft-deposit',
      tokenIds: ids,
      notice:
        'Unsigned NFT deposit: custody would move to the staking contract. Does not stake SQK or buy anything. Re-prepare before signing.',
    };
  }
  async prepareWithdraw(owner: string, values: readonly (string | bigint)[]) {
    const from = address(owner),
      ids = claimIds(values),
      snapshot = await this.verify({ confirmations: 0 });
    for (const id of ids)
      requireInput(
        (await this.tokenAt(from, id, snapshot)).custody === 'staking',
        `Squeek #${id} is not deposited by this wallet.`,
      );
    return {
      ...(await this.prepare(snapshot, from, A.staking, stakingAbi, 'withdraw', [A.nft, ids])),
      action: 'nft-withdraw',
      tokenIds: ids,
    };
  }
  async prepareMerge(owner: string, survivor: string | bigint, donor: string | bigint) {
    const from = address(owner),
      a = tokenId(survivor),
      b = tokenId(donor),
      snapshot = await this.verify({ confirmations: 0 });
    const result = await this.mergeAt(from, a, b, snapshot);
    if (!result.eligible)
      throw new SqueekKitError('NOT_MERGEABLE', 'These current-app Squeeks cannot merge.', {
        reasons: result.reasons,
      });
    const deposited = result.custody === 'staking';
    return {
      ...(await this.prepare(
        snapshot,
        from,
        deposited ? A.staking : A.nft,
        deposited ? stakingAbi : nftAbi,
        deposited ? 'mergeDeposited' : 'merge',
        deposited ? [A.nft, a, b] : [a, b],
      )),
      action: 'merge',
      ...result,
    };
  }
}
