import type { IncomingMessage, ServerResponse } from 'node:http';
export const CURRENT_API_ORIGIN = 'https://green-dispenser-04.squeekchain.com';
/** Two public GET routes only: no arbitrary upstream or wallet writes. */
export function currentApiProxy(fetcher: typeof fetch = globalThis.fetch) {
  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    if (!url.pathname.startsWith('/v1/')) return next();
    const account = /^\/v1\/accounts\/0x[\da-f]{40}$/i.test(url.pathname);
    const economy = url.pathname === '/v1/economy/state';
    if (!account && !economy) {
      res.statusCode = 404;
      res.end('Unsupported API route');
      return;
    }
    if (req.method !== 'GET') {
      res.statusCode = 405;
      res.setHeader('Allow', 'GET');
      res.end('Read-only API');
      return;
    }
    const keys = [...url.searchParams.keys()],
      cursor = url.searchParams.get('cursor');
    if (
      keys.some((k) => !['limit', 'cursor'].includes(k)) ||
      new Set(keys).size !== keys.length ||
      (!account && keys.length > 0) ||
      (account && url.searchParams.get('limit') !== '100') ||
      (cursor !== null && (!/^[\w-]+$/.test(cursor) || cursor.length > 4096))
    ) {
      res.statusCode = 400;
      res.end('Invalid query');
      return;
    }
    try {
      const upstream = await fetcher(CURRENT_API_ORIGIN + url.pathname + url.search, {
        headers: {
          Accept: 'application/json',
          ...(typeof req.headers['if-none-match'] === 'string'
            ? { 'If-None-Match': req.headers['if-none-match'] }
            : {}),
        },
        redirect: 'error',
        credentials: 'omit',
        signal: AbortSignal.timeout(12000),
      });
      const body = await upstream.text();
      if (body.length > 2_000_000) throw Error('Oversized upstream');
      res.statusCode = upstream.status;
      for (const key of ['etag', 'retry-after']) {
        const value = upstream.headers.get(key);
        if (value) res.setHeader(key, value);
      }
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store');
      res.end(body);
    } catch {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Current testnet API unavailable' }));
    }
  };
}
