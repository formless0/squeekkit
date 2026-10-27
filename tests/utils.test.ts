import { test, expect } from 'vitest';
import {
  tokenId,
  claimIds,
  stringify,
  formatAmount,
  publicError,
  SqueekKitError,
  evaluateMerge,
} from '../packages/sdk/src';
import { position } from './fixtures/chain';
test.each(['-1', '0', '01', '1.5', '1e3', '0xff', '', ' 1', (2n ** 256n).toString()])(
  'rejects invalid token ID %s',
  (id) => expect(() => tokenId(id)).toThrow(),
);
test('handles uint256 without floating point', () =>
  expect(tokenId((2n ** 256n - 1n).toString())).toBe(2n ** 256n - 1n));
test('claim limits apply before deduplication', () => {
  expect(() => claimIds([])).toThrow();
  expect(() => claimIds(Array(33).fill('1'))).toThrow();
});
test('serializes bigint as decimal strings and formats precisely', () => {
  expect(stringify({ n: 9007199254740993n })).toContain('"9007199254740993"');
  expect(formatAmount(1234567890123456789000n)).toBe('1,234.5678');
  expect(formatAmount(-1000000000000000001n)).toBe('-1');
});
test('never exposes raw provider errors or secrets', () => {
  expect(
    JSON.stringify(publicError(new Error('https://provider/SECRET?key=secret'))),
  ).not.toContain('SECRET');
  expect(publicError(new SqueekKitError('REORG', 'Read again.')).code).toBe('REORG');
});
test.each([
  [{ survivorId: 1n, donorId: 1n }, 'different'],
  [{ donor: { ...position, level: 2 } }, 'same level'],
  [{ survivor: { ...position, level: 0 } }, 'live mining'],
  [{ maximumLevel: 1 }, 'maximum'],
  [{ donor: { ...position, pendingRound: 3 } }, 'pending'],
  [{ height: 99n }, '1 more completed'],
])('explains merge failure case %#', (override, reason) => {
  const result = evaluateMerge({
    survivorId: 1n,
    donorId: 2n,
    survivor: position,
    donor: position,
    height: 100n,
    maximumLevel: 10,
    ...override,
  });
  expect(result.eligible).toBe(false);
  expect(result.reasons.join(' ')).toContain(reason);
});
test('cooldown boundary is inclusive', () =>
  expect(
    evaluateMerge({
      survivorId: 1n,
      donorId: 2n,
      survivor: position,
      donor: position,
      height: 100n,
      maximumLevel: 10,
    }).eligible,
  ).toBe(true));
