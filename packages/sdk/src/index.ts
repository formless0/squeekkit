export { SqueekChain, type ChainOptions } from './chain';
export { SqueekApi, type ApiOptions, type OwnerPage } from './api';
export {
  DEPLOYMENT,
  ADDRESSES,
  CHAIN_ID,
  BLOCK_UNITS,
  DEFAULT_API_URL,
  DEFAULT_RPC_URL,
} from './deployment';
export { verifyDeployment, type Snapshot } from './verify';
export { evaluateMerge, type Position, type MergeInput } from './merge';
export { SqueekKitError, publicError, type ErrorCode } from './errors';
export { address, tokenId, claimIds, stringify, jsonValue, formatAmount } from './utils';
export { SqueekCoreAbi, SqueekMiningAbi, SqueekTokenAbi, SqueekNFTAbi } from './generated/abis';
import { SqueekChain, type ChainOptions } from './chain';
import { SqueekApi, type ApiOptions } from './api';
export function createSqueekKit(options: { chain?: ChainOptions; api?: ApiOptions } = {}) {
  return { chain: new SqueekChain(options.chain), api: new SqueekApi(options.api) };
}
export { CURRENT_TESTNET, CURRENT_ADDRESSES } from './current-profile';
export { CurrentTestnetChain, type CurrentSnapshot } from './current-chain';
export { CurrentTestnetApi, type CurrentAccountPage } from './current-api';
export * from './generated/current/abis';
import { CurrentTestnetChain } from './current-chain';
import { CurrentTestnetApi } from './current-api';
/** Explicit opt-in to the current official app's observed Sepolia deployment. */
export function createCurrentTestnet(options: { chain?: ChainOptions; api?: ApiOptions } = {}) {
  return { chain: new CurrentTestnetChain(options.chain), api: new CurrentTestnetApi(options.api) };
}
