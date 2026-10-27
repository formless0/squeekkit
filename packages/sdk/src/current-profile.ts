import { getAddress } from 'viem';
import record from './generated/current/profile.json';
function freeze<T>(value: T): Readonly<T> {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}
/** Separate, observed app deployment. Never replaces the official legacy manifest. */
export const CURRENT_TESTNET = freeze(record);
export const CURRENT_ADDRESSES = Object.freeze({
  core: getAddress(record.contracts.core.address),
  mining: getAddress(record.contracts.mining.address),
  staking: getAddress(record.contracts.staking.address),
  nft: getAddress(record.contracts.nft.address),
  token: getAddress(record.contracts.token.address),
});
