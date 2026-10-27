import { describe, test, expect } from 'vitest';
import { decodeFunctionData } from 'viem';
import { SqueekChain, ADDRESSES, SqueekMiningAbi, verifyDeployment } from '../packages/sdk/src';
import { chainFixture, OWNER, OTHER } from './fixtures/chain';
describe('verified chain reads and transaction preparation', () => {
  test('checks real published runtime bytecode hashes and pins all reads to one block', async () => {
    const { client, calls } = chainFixture();
    const result = await new SqueekChain({ publicClient: client }).protocol();
    expect(result.snapshot.verified).toBe(true);
    expect(result.core.blockHeight).toBeTypeOf('bigint');
    const blocks = calls
      .filter((c) => ['eth_call', 'eth_getStorageAt', 'eth_getCode'].includes(c.method))
      .map((c) => c.params.at(-1));
    expect(new Set(blocks).size).toBe(1);
    expect(calls.every((c) => !/send|sign/i.test(c.method))).toBe(true);
  });
  test.each([
    [{ wrongChain: true }, 'WRONG_CHAIN'],
    [{ invalidCode: true }, 'DEPLOYMENT_MISMATCH'],
    [{ drift: true }, 'DEPLOYMENT_MISMATCH'],
    [{ reorg: true }, 'REORG'],
  ] as const)('rejects an unsafe snapshot %j', async (options, code) => {
    await expect(verifyDeployment(chainFixture(options).client)).rejects.toMatchObject({ code });
  });
  test('audit reports configuration drift but cannot make action preparation bypass it', async () => {
    const chain = new SqueekChain({ publicClient: chainFixture({ drift: true }).client });
    const audit = await chain.auditProtocol();
    expect(audit.snapshot.verified).toBe(false);
    expect(audit.snapshot.configurationDrift[0]?.field).toBe('core.configuration.reporter');
    await expect(chain.prepareClaim(OWNER, ['8889'])).rejects.toMatchObject({
      code: 'DEPLOYMENT_MISMATCH',
    });
  });
  test.each(['core', 'mining', 'sqkCore'] as const)(
    'rejects wrong contract graph link %s',
    async (target) => {
      const { client } = chainFixture({
        overrideRead: (name, _, value) => (name === target ? OTHER : value),
      });
      await expect(verifyDeployment(client)).rejects.toMatchObject({ code: 'DEPLOYMENT_MISMATCH' });
    },
  );
  test.each([
    'implementationCodeAddress',
    'implementationCodeVersion',
    'implementationStorageLayoutDigest',
  ])('rejects wrong identity %s', async (target) => {
    const { client } = chainFixture({
      overrideRead: (name, _, value) =>
        name !== target
          ? value
          : target === 'implementationCodeAddress'
            ? OTHER
            : target === 'implementationCodeVersion'
              ? 999n
              : '0x' + '00'.repeat(32),
    });
    await expect(verifyDeployment(client)).rejects.toMatchObject({ code: 'DEPLOYMENT_MISMATCH' });
  });
  test('reads ownership and batch rewards without loss of precision', async () => {
    const chain = new SqueekChain({ publicClient: chainFixture().client });
    const data = await chain.inspectSqueeks(OWNER, ['8889', '8890']);
    expect(data.positions).toHaveLength(2);
    expect(data.batchClaimableBaseUnits).toBe(900719925474099312345678901n);
  });
  test('rejects an unowned ID without silently dropping it', async () => {
    const { client, calls } = chainFixture({ wrongOwner: true });
    await expect(
      new SqueekChain({ publicClient: client }).prepareClaim(OWNER, ['8889']),
    ).rejects.toMatchObject({ code: 'NOT_OWNER' });
    expect(
      calls.some((c) => c.method === 'eth_call' && (c.params[0] as { from?: string }).from),
    ).toBe(false);
  });
  test('claim bundle sorts IDs, preserves amounts and simulates from the owner at the verified block', async () => {
    const { client, calls } = chainFixture();
    const result = await new SqueekChain({ publicClient: client }).prepareClaim(OWNER, [
      '8890',
      '8889',
      '8889',
    ]);
    expect(result.tokenIds).toEqual([8889n, 8890n]);
    expect(result.needsWalletSignature).toBe(true);
    expect(result.bundle.from).toBe(OWNER);
    expect(result.bundle.calls[0]?.to).toBe(ADDRESSES.mining);
    expect(result.simulatedPayoutBaseUnits).toBe(900719925474099312345678901n);
    const decoded = decodeFunctionData({
      abi: SqueekMiningAbi,
      data: result.bundle.calls[0]!.data,
    });
    expect(decoded.functionName).toBe('claim');
    expect(decoded.args).toEqual([0, [8889n, 8890n]]);
    const simulation = calls.find(
      (c) => c.method === 'eth_call' && (c.params[0] as { from?: string }).from,
    );
    expect((simulation?.params[0] as { from: string }).from.toLowerCase()).toBe(
      OWNER.toLowerCase(),
    );
  });
  test('zero payout is valid', async () => {
    const chain = new SqueekChain({
      publicClient: chainFixture({
        overrideRead: (name, _, value) => (name === 'claim' ? 0n : value),
      }).client,
    });
    expect((await chain.prepareClaim(OWNER, ['8889'])).simulatedPayoutBaseUnits).toBe(0n);
  });
  test('merge keeps explicit survivor/donor order and includes permanent burn warning', async () => {
    const result = await new SqueekChain({ publicClient: chainFixture().client }).prepareMerge(
      OWNER,
      '8890',
      '8889',
    );
    expect(result.warning).toContain('#8889 will be burned permanently');
    expect(
      decodeFunctionData({ abi: SqueekMiningAbi, data: result.bundle.calls[0]!.data }).args,
    ).toEqual([0, 8890n, 8889n]);
  });
  test.each([{ pending: true }, { cooldown: true }])(
    'refuses ineligible merge %j',
    async (options) => {
      const chain = new SqueekChain({ publicClient: chainFixture(options).client });
      expect((await chain.checkMerge(OWNER, '8889', '8890')).eligible).toBe(false);
      await expect(chain.prepareMerge(OWNER, '8889', '8890')).rejects.toMatchObject({
        code: 'NOT_MERGEABLE',
      });
    },
  );
  test.each(['claim', 'merge'])(
    'reports failed %s simulation without retrying another action',
    async (action) => {
      const chain = new SqueekChain({
        publicClient: chainFixture({ failSimulation: true }).client,
      });
      await expect(
        action === 'claim'
          ? chain.prepareClaim(OWNER, ['8889'])
          : chain.prepareMerge(OWNER, '8889', '8890'),
      ).rejects.toMatchObject({ code: 'SIMULATION_FAILED' });
    },
  );
  test.each([{ stale: true }, { tipMoves: true }])(
    'does not return a stale prepared bundle %j',
    async (options) => {
      await expect(
        new SqueekChain({ publicClient: chainFixture(options).client }).prepareClaim(OWNER, [
          '8889',
        ]),
      ).rejects.toMatchObject({ code: 'STALE_SNAPSHOT' });
    },
  );
  test('validates inputs before RPC', async () => {
    const { client, calls } = chainFixture();
    const chain = new SqueekChain({ publicClient: client });
    await expect(chain.prepareClaim('bad', ['1'])).rejects.toMatchObject({ code: 'INVALID_INPUT' });
    await expect(chain.prepareMerge(OWNER, '1e3', '2')).rejects.toMatchObject({
      code: 'INVALID_INPUT',
    });
    expect(calls).toHaveLength(0);
  });
});
