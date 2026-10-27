import { test, expect } from 'vitest';
import { decodeFunctionData } from 'viem';
import {
  CurrentTestnetChain,
  CURRENT_ADDRESSES as A,
  CurrentMiningAbi,
  CurrentNftAbi,
  CurrentStakingAbi,
} from '../packages/sdk/src';
import { currentFixture, CURRENT_OWNER as owner, OTHER } from './fixtures/current';
const kit = (options: Parameters<typeof currentFixture>[0] = {}) =>
  new CurrentTestnetChain({ publicClient: currentFixture(options).client });
test('current-app profile verifies recorded code and graph without weakening legacy checks', async () => {
  const f = currentFixture(),
    c = new CurrentTestnetChain({ publicClient: f.client });
  const p = await c.protocol();
  expect(p.snapshot).toMatchObject({
    verified: true,
    verificationBasis: 'observed-official-app',
    profileId: 'sepolia-app-20261024-06',
  });
  expect(p.core.blockHeight).toBe(1752n);
  expect(f.calls.some((c) => /send|sign/i.test(c.method))).toBe(false);
});
for (const [flag, code] of [
  ['wrongChain', 'WRONG_CHAIN'],
  ['wrongCode', 'DEPLOYMENT_MISMATCH'],
  ['wrongSlot', 'DEPLOYMENT_MISMATCH'],
  ['drift', 'DEPLOYMENT_MISMATCH'],
  ['reorg', 'REORG'],
] as const)
  test(`current verification rejects ${flag}`, async () => {
    await expect(kit({ [flag]: true }).verify()).rejects.toMatchObject({ code });
  });
test('current account uses account rewards and preserves full-width values', async () => {
  const data = await kit().account(owner);
  expect(data.walletNfts).toBe(1111n);
  expect(data.claimRecipient).toBe(owner);
  expect(typeof data.account.creditScaled).toBe('bigint');
});
test('wallet and deposited NFTs are distinguished using custody and depositor', async () => {
  expect((await kit().inspectSqueeks(owner, ['8889'])).tokens[0]?.custody).toBe('wallet');
  expect((await kit({ deposited: true }).inspectSqueeks(owner, ['8889'])).tokens[0]?.custody).toBe(
    'staking',
  );
  await expect(
    kit({ deposited: true, wrongDepositor: true }).inspectSqueeks(owner, ['8889']),
  ).rejects.toMatchObject({ code: 'NOT_OWNER' });
  await expect(kit({ wrongOwner: true }).inspectSqueeks(owner, ['8889'])).rejects.toMatchObject({
    code: 'NOT_OWNER',
  });
});
test('claim is account-based, simulates exact payout and exposes redirected recipient / partial settlement', async () => {
  const result = await kit({ recipient: true, incomplete: true }).prepareClaim(owner);
  expect(result).toMatchObject({
    needsWalletSignature: true,
    recipient: OTHER,
    accountSettlementComplete: false,
    simulatedPayoutBaseUnits: 123456789123456789123n,
  });
  const decoded = decodeFunctionData({ abi: CurrentMiningAbi, data: result.bundle.calls[0]!.data });
  expect(decoded).toEqual({ functionName: 'claim', args: [owner] });
});
test('current wallet merge targets NFT and preserves explicit survivor order', async () => {
  const result = await kit().prepareMerge(owner, '8890', '8889');
  expect(result.bundle.calls[0]!.to).toBe(A.nft);
  expect(decodeFunctionData({ abi: CurrentNftAbi, data: result.bundle.calls[0]!.data })).toEqual({
    functionName: 'merge',
    args: [8890n, 8889n],
  });
  expect(result.warning).toContain('#8889 would be burned permanently');
});
test('deposited merge routes to staking only after depositor checks', async () => {
  const result = await kit({ deposited: true }).prepareMerge(owner, '8889', '8890');
  expect(result.bundle.calls[0]!.to).toBe(A.staking);
  expect(
    decodeFunctionData({ abi: CurrentStakingAbi, data: result.bundle.calls[0]!.data }),
  ).toEqual({ functionName: 'mergeDeposited', args: [A.nft, 8889n, 8890n] });
});
for (const flags of [{ mixed: true }, { cooldown: true }, { maxLevel: true }])
  test(`ineligible current merge: ${JSON.stringify(flags)}`, async () => {
    await expect(kit(flags).prepareMerge(owner, '8889', '8890')).rejects.toMatchObject({
      code: 'NOT_MERGEABLE',
    });
  });
test('same survivor and donor is refused', async () => {
  await expect(kit().prepareMerge(owner, '8889', '8889')).rejects.toMatchObject({
    code: 'NOT_MERGEABLE',
  });
});
test('deposit requires existing approval and never prepares an approval itself', async () => {
  await expect(
    kit({ approvalMissing: true }).prepareDeposit(owner, ['8889']),
  ).rejects.toMatchObject({ code: 'APPROVAL_REQUIRED' });
  const result = await kit().prepareDeposit(owner, ['8890', '8889', '8889']);
  expect(result.bundle.calls).toHaveLength(1);
  expect(result.tokenIds).toEqual([8889n, 8890n]);
  expect(
    decodeFunctionData({ abi: CurrentStakingAbi, data: result.bundle.calls[0]!.data }).functionName,
  ).toBe('deposit');
  await expect(kit({ deposited: true }).prepareDeposit(owner, ['8889'])).rejects.toMatchObject({
    code: 'INVALID_INPUT',
  });
});
test('withdraw checks deposited custody and depositor', async () => {
  const result = await kit({ deposited: true }).prepareWithdraw(owner, ['8889']);
  expect(result.action).toBe('nft-withdraw');
  await expect(kit().prepareWithdraw(owner, ['8889'])).rejects.toMatchObject({
    code: 'INVALID_INPUT',
  });
  await expect(
    kit({ deposited: true, wrongDepositor: true }).prepareWithdraw(owner, ['8889']),
  ).rejects.toMatchObject({ code: 'NOT_OWNER' });
});
test('preparation fails on stale snapshots and reverted simulation', async () => {
  await expect(kit({ stale: true }).prepareClaim(owner)).rejects.toMatchObject({
    code: 'STALE_SNAPSHOT',
  });
  await expect(kit({ failSimulation: true }).prepareClaim(owner)).rejects.toMatchObject({
    code: 'SIMULATION_FAILED',
  });
});
test('invalid owner and IDs fail before any network request', async () => {
  const f = currentFixture(),
    c = new CurrentTestnetChain({ publicClient: f.client });
  await expect(c.account('bad')).rejects.toMatchObject({ code: 'INVALID_INPUT' });
  await expect(c.inspectSqueeks(owner, [])).rejects.toMatchObject({ code: 'INVALID_INPUT' });
  expect(f.calls).toHaveLength(0);
});
