import { getAddress } from 'viem';
import record from './generated/sepolia.json';
function freeze<T>(obj: T): Readonly<T> {
  if (obj && typeof obj === 'object') {
    Object.values(obj).forEach(freeze);
    Object.freeze(obj);
  }
  return obj;
}
/** A pinned official record, not an auto-discovered or API-supplied deployment. */
export const DEPLOYMENT = freeze(record);
export const ADDRESSES = Object.freeze({
  core: getAddress(record.contracts.SqueekCore.address),
  mining: getAddress(record.contracts.SqueekMining.address),
  token: getAddress(record.contracts.SqueekToken.address),
  nft: getAddress(record.contracts.SqueekNFT.address),
});
export const DEFAULT_RPC_URL = 'https://ethereum-sepolia-rpc.publicnode.com';
export const DEFAULT_API_URL = 'https://api.squeekchain.com';
export const CHAIN_ID = 11155111;
export const COLLECTION = 0;
export const BLOCK_UNITS = 1_000_000_000n;
