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
