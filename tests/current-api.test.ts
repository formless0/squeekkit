import { test, expect, vi } from 'vitest';
import { CurrentTestnetApi } from '../packages/sdk/src';
import { currentPage, currentEconomy } from './fixtures/current-api';
import { CURRENT_OWNER as owner } from './fixtures/current';
test('native fetch keeps its browser/global receiver', async () => {
  const original = globalThis.fetch;
  vi.stubGlobal('fetch', function (this: typeof globalThis) {
    expect(this).toBe(globalThis);
    return Promise.resolve(Response.json(currentPage()));
  });
  try {
    expect((await new CurrentTestnetApi().portfolio(owner)).tokens).toHaveLength(2);
  } finally {
    vi.stubGlobal('fetch', original);
  }
});
test('current API reads exact integer values and separate wallet/deposit counts', async () => {
  const api = new CurrentTestnetApi({ fetch: async () => Response.json(currentPage()) });
  const p = await api.portfolio(owner);
  expect(p.claim.claimableBaseUnits).toBe('123456789123456789123');
  expect(p.tokens).toHaveLength(2);
  expect(p.source.kind).toBe('api-display-only');
  expect(
    (await new CurrentTestnetApi({ fetch: async () => Response.json(currentEconomy()) }).economy())
      .nft.live,
  ).toBe('9999');
});
test('current API accepts app-supported terminal/unavailable states and unknown base power', async () => {
  const p = currentPage() as any;
  p.tokens[0].mergeState = 'terminal';
  p.tokens[0].basePower = null;
  p.tokens[1].mergeState = 'mining_unavailable';
  const value = await new CurrentTestnetApi({ fetch: async () => Response.json(p) }).portfolio(
    owner,
  );
  expect(value.tokens[0]?.basePower).toBeNull();
  expect(value.tokens[1]?.mergeState).toBe('mining_unavailable');
});
for (const [name, mutate] of Object.entries({
  installation: (p: any): void => {
    p.installationId = 'other';
  },
  release: (p: any): void => {
    p.release = { ...p.release, id: 'other' };
  },
  core: (p: any): void => {
    p.identities.core = '0x' + '11'.repeat(20);
  },
  implementation: (p: any): void => {
    p.identities.mining.implementation = '0x' + '11'.repeat(20);
  },
  layout: (p: any): void => {
    p.identities.staking.storageLayoutDigest = '0x' + '11'.repeat(32);
  },
}))
  test('current API rejects ' + name + ' drift', async () => {
    const p = currentPage();
    mutate(p);
    await expect(
      new CurrentTestnetApi({ fetch: async () => Response.json(p) }).portfolio(owner),
    ).rejects.toMatchObject({ code: 'API_DEPLOYMENT_MISMATCH' });
  });
test('wrong owner, chain, unavailable data and invalid amounts are not zero balances', async () => {
  for (const raw of [
    { status: 'unavailable' },
    { ...currentPage(), account: '0x' + '11'.repeat(20) },
    { ...currentPage(), claim: { claimableBaseUnits: 123, complete: true, budget: '32' } },
    { ...currentPage(), chain: { ...currentPage().chain, chainId: '1' } },
  ])
    await expect(
      new CurrentTestnetApi({ fetch: async () => Response.json(raw) }).portfolio(owner),
    ).rejects.toBeDefined();
});
test('multiple account pages produce one complete portfolio', async () => {
  let calls = 0;
  const api = new CurrentTestnetApi({
    fetch: async () => {
      const p = currentPage();
      p.tokens = [p.tokens[calls]!];
      p.nextCursor = calls++ === 0 ? 'next' : null;
      return Response.json(p);
    },
  });
  expect((await api.portfolio(owner)).tokens.map((x) => x.tokenId)).toEqual(['8889', '8890']);
  expect(calls).toBe(2);
});
for (const issue of ['snapshot', 'duplicate', 'missing', 'loop', 'counts'])
  test('account pagination rejects ' + issue, async () => {
    let calls = 0;
    const api = new CurrentTestnetApi({
      fetch: async () => {
        const p = currentPage();
        const n = calls++;
        p.tokens = [p.tokens[n === 0 || issue === 'duplicate' ? 0 : 1]!];
        p.nextCursor = n === 0 || issue === 'loop' ? 'same' : null;
        if (n > 0 && issue === 'snapshot') p.chain.safeBlockHash = '0x' + 'ab'.repeat(32);
        if (n > 0 && issue === 'counts') p.tokenCounts.wallet = '3';
        if (issue === 'missing') p.nextCursor = null;
        return Response.json(p);
      },
    });
    await expect(api.portfolio(owner)).rejects.toMatchObject({ code: 'API_SCHEMA' });
  });
test('bounded pagination never silently returns a partial account', async () => {
  const p = currentPage();
  p.tokens = p.tokens.slice(0, 1);
  p.nextCursor = 'next';
  await expect(
    new CurrentTestnetApi({ fetch: async () => Response.json(p) }).portfolio(owner, 1),
  ).rejects.toMatchObject({ code: 'PAGINATION_LIMIT' });
});
test('invalid cursor and owner are rejected before fetching', async () => {
  let calls = 0;
  const api = new CurrentTestnetApi({
    fetch: async () => {
      calls++;
      return Response.json(currentPage());
    },
  });
  await expect(api.accountPage(owner, '../../evil')).rejects.toMatchObject({
    code: 'INVALID_INPUT',
  });
  await expect(api.portfolio('bad')).rejects.toMatchObject({ code: 'INVALID_INPUT' });
  expect(calls).toBe(0);
});
