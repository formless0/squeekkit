import { DEFAULT_API_URL } from './deployment';
import { SqueekKitError, requireInput } from './errors';
export interface ApiOptions {
  baseUrl?: string;
  fetch?: typeof fetch;
  timeoutMs?: number;
  retries?: number;
  sleep?: (ms: number) => Promise<void>;
}

/** Bounded JSON transport shared by the two explicitly separate APIs. */
export class JsonApiTransport {
  private base: string;
  private fetcher: typeof fetch;
  private timeout: number;
  private retries: number;
  private sleep: (ms: number) => Promise<void>;
  private cache = new Map<string, { etag: string; data: unknown }>();
  constructor(options: ApiOptions = {}) {
    const url = new URL(options.baseUrl ?? DEFAULT_API_URL);
    requireInput(
      url.protocol === 'https:' ||
        (url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)),
      'API URL must use HTTPS, or HTTP on localhost.',
    );
    requireInput(
      !url.username && !url.password && !url.search && !url.hash,
      'API base URL must not contain credentials, a query or fragment.',
    );
    this.base = url.origin;
    // Browser implementations can require the Window receiver; keep it bound.
    this.fetcher = options.fetch ?? globalThis.fetch.bind(globalThis);
    this.timeout = options.timeoutMs ?? 12000;
    this.retries = options.retries ?? 1;
    requireInput(
      this.timeout > 0 &&
        this.timeout <= 60000 &&
        Number.isInteger(this.retries) &&
        this.retries >= 0 &&
        this.retries <= 3,
      'Invalid timeout or retry budget.',
    );
    this.sleep = options.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  }
  protected async get(path: string): Promise<unknown> {
    const cached = this.cache.get(path);
    for (let attempt = 0; ; attempt++) {
      let response: Response;
      try {
        response = await this.fetcher(this.base + path, {
          headers: {
            Accept: 'application/json',
            ...(cached ? { 'If-None-Match': cached.etag } : {}),
          },
          signal: AbortSignal.timeout(this.timeout),
          redirect: 'error',
          credentials: 'omit',
        });
      } catch {
        throw new SqueekKitError(
          'API_TIMEOUT',
          'The public API could not be reached within the request budget.',
        );
      }
      if (response.status === 304) {
        if (!cached)
          throw new SqueekKitError(
            'API_SCHEMA',
            'API returned an unchanged response without a cached value.',
          );
        return cached.data;
      }
      if (!response.ok) {
        const retry = response.headers.get('retry-after');
        const seconds = retry
          ? /^\d+$/.test(retry)
            ? Number(retry)
            : Math.ceil((Date.parse(retry) - Date.now()) / 1000)
          : 1;
        if (
          [429, 503].includes(response.status) &&
          attempt < this.retries &&
          Number.isFinite(seconds) &&
          seconds >= 0 &&
          seconds <= 5
        ) {
          await this.sleep(seconds * 1000);
          continue;
        }
        throw new SqueekKitError('API_HTTP', `Public API returned HTTP ${response.status}.`, {
          status: response.status,
          retryAfterSeconds: Number.isFinite(seconds) ? seconds : null,
        });
      }
      let data: unknown;
      try {
        const text = await response.text();
        if (text.length > 2_000_000) throw Error();
        data = JSON.parse(text);
      } catch {
        throw new SqueekKitError('API_SCHEMA', 'API returned malformed or oversized JSON.');
      }
      const tag = response.headers.get('etag');
      if (tag) {
        if (this.cache.size >= 32) this.cache.delete(this.cache.keys().next().value!);
        this.cache.set(path, { etag: tag, data });
      }
      return data;
    }
  }
}
