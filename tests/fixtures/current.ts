import {
  createPublicClient,
  custom,
  decodeFunctionData,
  decodeFunctionResult,
  encodeFunctionResult,
  parseAbi,
  toHex,
  type Abi,
} from 'viem';
import record from './current-rpc-reference.json';
import {
  CURRENT_TESTNET,
  CURRENT_ADDRESSES as A,
  CurrentCoreAbi,
  CurrentMiningAbi,
  CurrentNftAbi,
  CurrentStakingAbi,
  CurrentTokenAbi,
} from '../../packages/sdk/src';
export const CURRENT_OWNER = CURRENT_TESTNET.links['nft.protocolRecipient'];
export const OTHER = '0x0000000000000000000000000000000000000001';
const zero = '0x0000000000000000000000000000000000000000';
export interface CurrentFixtureOptions {
  wrongChain?: boolean;
  wrongCode?: boolean;
  wrongSlot?: boolean;
  drift?: boolean;
  reorg?: boolean;
  stale?: boolean;
  wrongOwner?: boolean;
  deposited?: boolean;
  mixed?: boolean;
  wrongDepositor?: boolean;
  cooldown?: boolean;
  maxLevel?: boolean;
  approvalMissing?: boolean;
  failSimulation?: boolean;
  incomplete?: boolean;
  recipient?: boolean;
}
/** Real public current-app RPC capture; mutations, refreshed timestamps and deposit scenarios are synthetic test data. */
export function currentFixture(options: CurrentFixtureOptions = {}) {
  const calls: { method: string; params: readonly unknown[] }[] = [];
  let blocks = 0;
  const bn = record.blockNumber;
  const block = record.records.find((x) => x.method === 'eth_getBlockByNumber')!.result as Record<
    string,
    unknown
  >;
  const abis: Record<string, Abi> = {
    [A.core.toLowerCase()]: CurrentCoreAbi,
    [A.mining.toLowerCase()]: CurrentMiningAbi,
    [A.nft.toLowerCase()]: CurrentNftAbi,
    [A.staking.toLowerCase()]: CurrentStakingAbi,
    [A.token.toLowerCase()]: CurrentTokenAbi,
  };
  for (const key of ['core', 'mining', 'staking'] as const)
    abis[CURRENT_TESTNET.contracts[key].proxyAdmin.toLowerCase()] = parseAbi([
      'function owner() view returns(address)',
    ]);
  const client = createPublicClient({
    transport: custom(
      {
        request: async ({ method, params = [] }) => {
          const p = params as unknown[];
          calls.push({ method, params: p });
          if (method === 'eth_chainId') return options.wrongChain ? '0x1' : '0xaa36a7';
          if (method === 'eth_blockNumber') return bn;
          if (method === 'eth_getBlockByNumber') {
            blocks++;
            return {
              ...block,
              number: p[0],
              timestamp: toHex(BigInt(Math.floor(Date.now() / 1000) - (options.stale ? 400 : 10))),
              hash: options.reorg && blocks > 1 ? '0x' + 'aa'.repeat(32) : block.hash,
            };
          }
          const found = record.records.find(
            (r) =>
              r.method === method &&
              JSON.stringify(r.params?.slice(0, -1)).toLowerCase() ===
                JSON.stringify(p.slice(0, -1)).toLowerCase(),
          );
          if (method === 'eth_getCode') return options.wrongCode ? '0x01' : found?.result;
          if (method === 'eth_getStorageAt')
            return options.wrongSlot ? '0x' + '00'.repeat(32) : found?.result;
          if (method !== 'eth_call') throw Error('Unexpected RPC ' + method);
          const tx = p[0] as { to: string; data: `0x${string}` },
            abi = abis[tx.to.toLowerCase()]!;
          const { functionName: fn, args = [] } = decodeFunctionData({ abi, data: tx.data });
          const raw = record.records.find(
            (r) =>
              r.method === 'eth_call' &&
              (r.params?.[0] as any).to?.toLowerCase() === tx.to.toLowerCase() &&
              (r.params?.[0] as any).data?.toLowerCase() === tx.data.toLowerCase(),
          )?.result as `0x${string}` | undefined;
          let value: unknown =
            raw === undefined
              ? undefined
              : decodeFunctionResult({ abi, functionName: fn, data: raw });
          if (
            fn === 'configuration' &&
            tx.to.toLowerCase() === A.core.toLowerCase() &&
            options.drift
          )
            value = { ...(value as object), reporter: OTHER };
          if (fn === 'ownerOf')
            value = options.wrongOwner
              ? OTHER
              : options.deposited || (options.mixed && args[0] === 8890n)
                ? A.staking
                : CURRENT_OWNER;
          if (fn === 'depositor')
            value = options.wrongDepositor
              ? OTHER
              : options.deposited || options.mixed
                ? CURRENT_OWNER
                : zero;
          if (fn === 'nextMergeHeight' && options.cooldown) value = 999999n;
          if (fn === 'level' && options.maxLevel) value = 10;
          if (fn === 'getApproved') value = options.approvalMissing ? zero : A.staking;
          if (fn === 'isApprovedForAll') value = !options.approvalMissing;
          if (fn === 'account' && options.incomplete)
            value = { ...(value as object), complete: false };
          if (fn === 'claimRecipient' && options.recipient) value = OTHER;
          if (['merge', 'mergeDeposited', 'deposit', 'withdraw', 'claim'].includes(fn)) {
            if (options.failSimulation) throw Error('Execution reverted with private RPC secret');
            if (fn === 'claim') value = 123456789123456789123n;
            else value = undefined;
          } else if (value === undefined) throw Error('Unrecorded current fixture: ' + fn);
          return encodeFunctionResult({ abi, functionName: fn, result: value as never });
        },
      },
      { retryCount: 0 },
    ),
  });
  return { client, calls };
}
