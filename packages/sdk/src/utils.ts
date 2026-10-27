import { getAddress, isAddress, type Address } from 'viem';
import { requireInput } from './errors';
export function address(value: string): Address {
  requireInput(
    isAddress(value, { strict: true }),
    'Supply a valid, full Ethereum address (with valid checksum if mixed case).',
  );
  return getAddress(value);
}
export function tokenId(value: string | bigint): bigint {
  requireInput(
    typeof value === 'bigint' || /^(0|[1-9]\d*)$/.test(value),
    'Token IDs must be unsigned decimal integers.',
  );
  const n = BigInt(value);
  requireInput(n > 0n && n < 2n ** 256n, 'Token ID must be between 1 and uint256 maximum.');
  return n;
}
export function claimIds(values: readonly (string | bigint)[]): bigint[] {
  requireInput(
    values.length > 0 && values.length <= 32,
    'Choose between 1 and 32 token IDs. Split larger selections explicitly.',
  );
  return [...new Set(values.map(tokenId))].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}
export function stringify(value: unknown, space = 2): string {
  return JSON.stringify(
    value,
    (_, v: unknown) => (typeof v === 'bigint' ? v.toString() : v),
    space,
  );
}
export function jsonValue(value: unknown): Record<string, unknown> {
  return JSON.parse(stringify(value)) as Record<string, unknown>;
}
/** Display-only rounding; accounting remains in bigint base units. */
export function formatAmount(value: bigint, decimals = 18, precision = 4): string {
  requireInput(Number.isInteger(decimals) && decimals >= 0 && decimals <= 36, 'Invalid decimals.');
  requireInput(
    Number.isInteger(precision) && precision >= 0 && precision <= decimals,
    'Invalid precision.',
  );
  const sign = value < 0n ? '-' : '';
  const n = value < 0n ? -value : value;
  const scale = 10n ** BigInt(decimals);
  const tail = (n % scale)
    .toString()
    .padStart(decimals, '0')
    .slice(0, precision)
    .replace(/0+$/, '');
  return sign + (n / scale).toLocaleString('en-US') + (tail ? '.' + tail : '');
}
