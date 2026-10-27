import {
  createPublicClient,
  custom,
  decodeFunctionData,
  decodeFunctionResult,
  encodeFunctionResult,
  toHex,
  type Abi,
} from 'viem';
import record from './rpc-reference.json';
import {
  ADDRESSES,
  DEPLOYMENT,
  SqueekCoreAbi,
  SqueekMiningAbi,
  SqueekNFTAbi,
  SqueekTokenAbi,
} from '../../packages/sdk/src';

export const OWNER = '0x828CB04Dbf0BDd8eB35d19045638a1af6E3D17E8';
export const OTHER = '0x0000000000000000000000000000000000000001';
export const position = {
  activeWeight: 1000n,
  pendingWeight: 0n,
  pendingRound: 0,
  nextMergeBlock: 100,
  level: 1,
  lastIndex: 0n,
  accruedScaled: 5n,
};
export interface FixtureOptions {
  drift?: boolean;
  wrongChain?: boolean;
  reorg?: boolean;
  invalidCode?: boolean;
  wrongOwner?: boolean;
  pending?: boolean;
  cooldown?: boolean;
  failSimulation?: boolean;
  stale?: boolean;
  tipMoves?: boolean;
  overrideRead?: (fn: string, target: string, value: unknown) => unknown;
}
/** Recorded public code/storage + explicit synthetic positions and restored launch reporter.
 * These are test responses, never presented as a current network snapshot. */
export function chainFixture(options: FixtureOptions = {}) {
  const calls: { method: string; params: readonly unknown[] }[] = [];
  let blockReads = 0,
    tipReads = 0;
  const blockRecord = record.records.find((x) => x.method === 'eth_getBlockByNumber')!
    .result as Record<string, unknown>;
  const abis: Record<string, Abi> = {
    [ADDRESSES.core.toLowerCase()]: SqueekCoreAbi,
    [ADDRESSES.mining.toLowerCase()]: SqueekMiningAbi,
    [ADDRESSES.nft.toLowerCase()]: SqueekNFTAbi,
    [ADDRESSES.token.toLowerCase()]: SqueekTokenAbi,
  };
  const client = createPublicClient({
    transport: custom(
      {
        request: async ({
          method,
          params = [],
        }: {
          method: string;
          params?: readonly unknown[];
        }) => {
          calls.push({ method, params });
          if (method === 'eth_chainId') return toHex(options.wrongChain ? 1 : 11155111);
          if (method === 'eth_blockNumber')
            return toHex(
              BigInt(record.blockNumber) + (options.tipMoves && ++tipReads > 1 ? 20n : 0n),
            );
          if (method === 'eth_getBlockByNumber')
            return {
              ...blockRecord,
              number: params[0],
              timestamp: toHex(BigInt(Math.floor(Date.now() / 1000) - (options.stale ? 600 : 0))),
              hash: options.reorg && ++blockReads > 1 ? '0x' + 'ab'.repeat(32) : blockRecord.hash,
            };
          if (method === 'eth_getCode' && options.invalidCode) return '0x1234';
          if (method === 'eth_call') {
            const call = params[0] as { to: string; data: `0x${string}`; from?: string };
            const abi = abis[call.to.toLowerCase()];
            if (abi) {
              const decoded = decodeFunctionData({ abi, data: call.data });
              const name = decoded.functionName;
              let result: unknown;
              if (name === 'ownerOf') result = options.wrongOwner ? OTHER : OWNER;
              else if (name === 'position')
                result = {
                  ...position,
                  pendingRound: options.pending ? 7 : 0,
                  nextMergeBlock: options.cooldown ? 999999 : 0,
                };
              else if (name === 'claimable' || name === 'claim')
                result = 900719925474099312345678901n;
              else if (name === 'merge') {
                if (options.failSimulation) throw new Error('execution reverted');
                return '0x';
              } else {
                const original = record.records.find(
                  (x) =>
                    x.method === method &&
                    (x.params[0] as { to: string; data: string }).to.toLowerCase() ===
                      call.to.toLowerCase() &&
                    (x.params[0] as { data: string }).data === call.data,
                );
                if (original)
                  result = decodeFunctionResult({
                    abi,
                    functionName: name,
                    data: original.result as `0x${string}`,
                  });
                if (
                  name === 'configuration' &&
                  call.to.toLowerCase() === ADDRESSES.core.toLowerCase() &&
                  !options.drift
                )
                  result = {
                    ...(result as object),
                    reporter: DEPLOYMENT.coreConfiguration.reporter,
                  };
              }
              if (name === 'claim' && options.failSimulation) throw new Error('execution reverted');
              if (result !== undefined) {
                result = options.overrideRead
                  ? options.overrideRead(name, call.to.toLowerCase(), result)
                  : result;
                return encodeFunctionResult({ abi, functionName: name, result });
              }
            }
          }
          const matched = record.records.find((x) => {
            if (x.method !== method) return false;
            const a = JSON.stringify(x.params.slice(0, -1)).toLowerCase(),
              b = JSON.stringify(params.slice(0, -1)).toLowerCase();
            return a === b;
          });
          if (matched) return matched.result;
          throw new Error('Unexpected fixture request: ' + method);
        },
      },
      { retryCount: 0 },
    ),
  });
  return { client, calls };
}
