import { test, expect, vi } from 'vitest';
import { SqueekApi, ADDRESSES, DEPLOYMENT } from '../packages/sdk/src';
import { OWNER, OTHER } from './fixtures/chain';
function page(overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: 1,
    status: 'available',
    installationId: 'documented',
    release: { id: DEPLOYMENT.release },
    identities: {
      core: ADDRESSES.core,
      mining: ADDRESSES.mining,
      token: ADDRESSES.token,
      collection: ADDRESSES.nft,
    },
    chain: {
      chainId: '11155111',
      safeThroughBlock: '12000000',
      safeBlockHash: '0x' + 'aa'.repeat(32),
    },
    owner: OWNER,
    positions: [
      {
        tokenId: '1',
        level: 1,
        activeWeight: '1000',
        claimableBaseUnits: '900719925474099312345678901',
      },
    ],
    nextCursor: null,
    ...overrides,
  };
}
function setup(values: (Response | object)[]) {
  const fetcher = vi.fn(async () => {
    const next = values.shift();
    if (!next) throw Error('Unexpected request');
    return next instanceof Response ? next : Response.json(next);
  });
  const sleep = vi.fn(async () => {});
  return { api: new SqueekApi({ fetch: fetcher as typeof fetch, sleep }), fetcher, sleep };
}
test('complete pagination preserves large balances', async () => {
  const { api } = setup([
    page({ nextCursor: 'next' }),
    page({
      positions: [{ tokenId: '2', level: 2, activeWeight: '3000', claimableBaseUnits: '1' }],
    }),
  ]);
  const p = await api.portfolio(OWNER);
  expect(p.positions).toHaveLength(2);
  expect(p.sumOfIndividualClaimableBaseUnits).toBe(900719925474099312345678902n);
});
test('empty available wallet is distinct from unavailable', async () => {
  const { api } = setup([
    page({ positions: [] }),
    { status: 'unavailable', reason: 'indexer_disabled' },
  ]);
  expect((await api.portfolio(OWNER)).positions).toEqual([]);
  await expect(api.portfolio(OWNER)).rejects.toMatchObject({ code: 'API_UNAVAILABLE' });
});
test.each([
  [{ identities: { core: OTHER } }, 'API_DEPLOYMENT_MISMATCH'],
  [{ identities: { core: ADDRESSES.core, mining: OTHER } }, 'API_DEPLOYMENT_MISMATCH'],
  [{ release: { id: 'other' } }, 'API_DEPLOYMENT_MISMATCH'],
  [{ chain: { chainId: '1', safeThroughBlock: '1' } }, 'API_DEPLOYMENT_MISMATCH'],
  [{ schemaVersion: 2 }, 'API_SCHEMA'],
  [{ owner: OTHER }, 'API_SCHEMA'],
  [
    { positions: [{ tokenId: '1', level: 1, activeWeight: 1, claimableBaseUnits: '0' }] },
    'API_SCHEMA',
  ],
  [{ positions: undefined }, 'API_SCHEMA'],
  [{ nextCursor: undefined }, 'API_SCHEMA'],
])('rejects unsupported or malformed response %j', async (change, code) => {
  await expect(setup([page(change)]).api.portfolio(OWNER)).rejects.toMatchObject({ code });
});
test.each([
  page({ chain: { chainId: '11155111', safeThroughBlock: '12000001' } }),
  page({ positions: [{ tokenId: '1', level: 1, activeWeight: '1000', claimableBaseUnits: '0' }] }),
])('does not return totals from inconsistent or duplicated pages', async (second) => {
  await expect(
    setup([page({ nextCursor: 'next' }), second]).api.portfolio(OWNER),
  ).rejects.toMatchObject({ code: 'API_SCHEMA' });
});
test('bounds loops and does not silently return a partial portfolio', async () => {
  await expect(setup([page({ nextCursor: 'next' })]).api.portfolio(OWNER, 1)).rejects.toMatchObject(
    { code: 'PAGINATION_LIMIT' },
  );
  await expect(
    setup([
      page({ positions: [], nextCursor: 'next' }),
      page({ positions: [], nextCursor: 'next' }),
    ]).api.portfolio(OWNER),
  ).rejects.toMatchObject({ code: 'API_SCHEMA' });
});
test('reorg-invalidated cursor requires a new read', async () => {
  await expect(
    setup([new Response('', { status: 409 })]).api.portfolio(OWNER),
  ).rejects.toMatchObject({ code: 'API_HTTP', details: { status: 409 } });
});
test('conditional GET reuses a cached response on 304', async () => {
  const { api, fetcher } = setup([
    Response.json(page(), { headers: { etag: '"abc"' } }),
    new Response(null, { status: 304 }),
  ]);
  await api.core();
  await api.core();
  expect((fetcher.mock.calls[1] as unknown as [string, RequestInit])[1].headers).toMatchObject({
    'If-None-Match': '"abc"',
  });
});
test('304 without cache is invalid', async () => {
  await expect(setup([new Response(null, { status: 304 })]).api.core()).rejects.toMatchObject({
    code: 'API_SCHEMA',
  });
});
test('respects bounded Retry-After and limits retry count', async () => {
  const limited = () => new Response('', { status: 429, headers: { 'Retry-After': '2' } });
  const { api, sleep, fetcher } = setup([limited(), page()]);
  await api.core();
  expect(sleep).toHaveBeenCalledWith(2000);
  expect(fetcher).toHaveBeenCalledTimes(2);
  const failed = setup([limited(), limited(), page()]);
  await expect(failed.api.core()).rejects.toMatchObject({ code: 'API_HTTP' });
  expect(failed.fetcher).toHaveBeenCalledTimes(2);
});
test('long Retry-After is returned without an early retry', async () => {
  const { api, sleep, fetcher } = setup([
    new Response('', { status: 503, headers: { 'Retry-After': '60' } }),
  ]);
  await expect(api.core()).rejects.toMatchObject({ details: { retryAfterSeconds: 60 } });
  expect(sleep).not.toHaveBeenCalled();
  expect(fetcher).toHaveBeenCalledTimes(1);
});
test('network errors are sanitized', async () => {
  const api = new SqueekApi({
    fetch: async () => {
      throw Error('SECRET');
    },
  });
  await expect(api.core()).rejects.toMatchObject({ code: 'API_TIMEOUT' });
});
test.each([new Response('no json'), new Response('x'.repeat(2_000_001))])(
  'rejects non-JSON or oversized responses',
  async (r) => {
    await expect(setup([r]).api.core()).rejects.toMatchObject({ code: 'API_SCHEMA' });
  },
);
test('compatibility reports mismatches without suggesting new addresses', async () => {
  const result = await setup([page({ identities: { core: OTHER } })]).api.compatibility();
  expect(result.compatible).toBe(false);
  expect(result).toMatchObject({ code: 'API_DEPLOYMENT_MISMATCH' });
});
test('ignores additive fields while preserving metadata as data', async () => {
  const result = await setup([
    page({ futureField: { name: '<script>alert(1)</script>' } }),
  ]).api.core();
  expect(result.futureField).toBeDefined();
});
test.each(['http://example.com', 'https://user:pass@example.com', 'https://example.com/?secret=x'])(
  'rejects unsafe API base %s',
  (baseUrl) => expect(() => new SqueekApi({ baseUrl })).toThrow(),
);
test('bad user inputs never reach fetch', async () => {
  const { api, fetcher } = setup([]);
  await expect(api.ownerPage('bad')).rejects.toMatchObject({ code: 'INVALID_INPUT' });
  await expect(api.ownerPage(OWNER, '../../../secret')).rejects.toMatchObject({
    code: 'INVALID_INPUT',
  });
  expect(fetcher).not.toHaveBeenCalled();
});
