import { test, expect } from 'vitest';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { currentApiProxy, CURRENT_API_ORIGIN } from '../apps/demo/api-proxy';
async function call(
  url: string,
  method = 'GET',
  fetcher: typeof fetch = async () => Response.json({ ok: true }),
) {
  const state = { statusCode: 200, body: '', headers: {} as Record<string, string>, next: false };
  const req = {
    url,
    method,
    headers: { cookie: 'private-cookie', authorization: 'Bearer private' },
  } as IncomingMessage;
  const res = {
    set statusCode(n: number) {
      state.statusCode = n;
    },
    setHeader(k: string, v: string) {
      state.headers[k] = v;
    },
    end(s: string) {
      state.body = s;
    },
  } as ServerResponse;
  await currentApiProxy(fetcher)(req, res, () => {
    state.next = true;
  });
  return state;
}
test('demo proxy forwards only fixed public read endpoints without private request headers', async () => {
  let target = '',
    headers: HeadersInit | undefined;
  const r = await call(
    '/v1/accounts/0x' + '11'.repeat(20) + '?limit=100',
    'GET',
    async (url, options) => {
      target = String(url);
      headers = options?.headers;
      return Response.json({ status: 'available' }, { headers: { etag: 'test' } });
    },
  );
  expect(target).toBe(CURRENT_API_ORIGIN + '/v1/accounts/0x' + '11'.repeat(20) + '?limit=100');
  expect(headers).toEqual({ Accept: 'application/json' });
  expect(r.headers.etag).toBe('test');
  expect(r.statusCode).toBe(200);
});
for (const [url, method, status] of [
  ['/v1/economy/state', 'POST', 405],
  ['/v1/private', 'GET', 404],
  ['/v1/economy/state?url=https://evil.test', 'GET', 400],
  ['/v1/accounts/0x' + '11'.repeat(20) + '?limit=100&limit=100', 'GET', 400],
] as const)
  test('demo proxy rejects ' + method + ' ' + url, async () => {
    let fetched = false;
    const r = await call(url, method, async () => {
      fetched = true;
      return Response.json({});
    });
    expect(r.statusCode).toBe(status);
    expect(fetched).toBe(false);
  });
test('demo proxy hides upstream exceptions and leaves ordinary app paths alone', async () => {
  expect((await call('/')).next).toBe(true);
  const r = await call('/v1/economy/state', 'GET', async () => {
    throw Error('secret');
  });
  expect(r.statusCode).toBe(502);
  expect(r.body).not.toContain('secret');
});
