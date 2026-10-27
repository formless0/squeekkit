import { CURRENT_TESTNET as p, CURRENT_ADDRESSES as A } from '../../packages/sdk/src';
import { CURRENT_OWNER } from './current';
/** Synthetic display response for deterministic tests; not live user data. */
export function currentPage() {
  return {
    schemaVersion: 2,
    status: 'available',
    installationId: p.installationId,
    generatedAt: '2026-10-27T10:44:00Z',
    release: p.release,
    chain: {
      chainId: '11155111',
      safeThroughBlock: '12004593',
      safeBlockHash: p.provenance.blockHash,
      safeBlockTimestamp: '2026-10-27T10:44:00Z',
    },
    identities: {
      core: A.core,
      token: A.token,
      genesis: A.nft,
      launch: p.links['staking.launch'],
      ...Object.fromEntries(
        (['mining', 'staking'] as const).map((name) => [
          name,
          {
            proxy: p.contracts[name].address,
            implementation: p.contracts[name].implementation,
            implementationVersion: p.contracts[name].version,
            storageLayoutDigest: p.contracts[name].layout,
          },
        ]),
      ),
    },
    account: CURRENT_OWNER,
    claim: { claimableBaseUnits: '123456789123456789123', complete: true, budget: '32' },
    stake: {
      principalBaseUnits: '100',
      freshBaseUnits: '0',
      matureBaseUnits: '100',
      freshUntilRound: '1',
    },
    tokens: [
      {
        tokenId: '8889',
        custody: 'wallet',
        level: 1,
        basePower: '1000',
        nextMergeHeight: '0',
        mergeState: 'ready',
      },
      {
        tokenId: '8890',
        custody: 'wallet',
        level: 1,
        basePower: '1000',
        nextMergeHeight: '0',
        mergeState: 'ready',
      },
    ],
    tokenCounts: { wallet: '2', staking: '0' },
    nextCursor: null as string | null,
  };
}
export function currentEconomy() {
  return {
    ...currentPage(),
    supply: { liveSupplyBaseUnits: '123456789123456789123', paidBaseUnits: '20' },
    nft: { live: '9999', issued: '9999', burned: '0' },
    mining: { processedThroughRound: '328', totalNftPower: '1000', totalSqkPower: '1' },
  };
}
