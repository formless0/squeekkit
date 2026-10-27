import { z } from 'zod';
import { ADDRESSES, CHAIN_ID, DEFAULT_API_URL, DEPLOYMENT } from './deployment';
import { address } from './utils';
import { SqueekKitError, requireInput } from './errors';

const uint = z.string().regex(/^(0|[1-9]\d*)$/);
const ethAddress = z.string().regex(/^0x[0-9a-fA-F]{40}$/);
const envelope = z
  .object({
    schemaVersion: z.literal(1),
    status: z.literal('available'),
    installationId: z.string(),
    chain: z
      .object({
        chainId: uint,
        safeThroughBlock: uint,
        safeBlockHash: z
          .string()
          .regex(/^0x[0-9a-fA-F]{64}$/)
          .optional(),
      })
      .passthrough(),
    identities: z.object({ core: ethAddress }).passthrough(),
    release: z.object({ id: z.string() }).passthrough().optional(),
  })
  .passthrough();
const position = z
  .object({
    tokenId: uint,
    level: z.number().int().min(1).max(255),
    activeWeight: uint,
    claimableBaseUnits: uint,
  })
  .passthrough();
const ownerPage = envelope.extend({
  owner: ethAddress,
  positions: z.array(position),
  nextCursor: z.string().nullable(),
});
export type OwnerPage = z.infer<typeof ownerPage>;
export interface ApiOptions {
  baseUrl?: string;
  fetch?: typeof fetch;
  timeoutMs?: number;
  retries?: number;
  sleep?: (ms: number) => Promise<void>;
}

/** Read-only display API. This class is never an input source for transaction preparation. */
export class SqueekApi {
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
    this.fetcher = options.fetch ?? globalThis.fetch;
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
  private async get(path: string): Promise<unknown> {
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
  private checked(data: unknown) {
    if (data && typeof data === 'object' && 'status' in data && data.status === 'unavailable')
      throw new SqueekKitError(
        'API_UNAVAILABLE',
        'The API reports unavailable data. Values are unknown, not zero.',
      );
    const result = envelope.safeParse(data);
    if (!result.success)
      throw new SqueekKitError('API_SCHEMA', 'API response does not match the supported schema.');
    const value = result.data;
    if (
      value.chain.chainId !== String(CHAIN_ID) ||
      value.identities.core.toLowerCase() !== ADDRESSES.core.toLowerCase() ||
      (value.release && value.release.id !== DEPLOYMENT.release)
    ) {
      throw new SqueekKitError(
        'API_DEPLOYMENT_MISMATCH',
        'The public API is serving a different deployment. Its balances and rewards cannot be combined with this SDK release.',
        {
          expectedCore: ADDRESSES.core,
          actualCore: value.identities.core,
          expectedRelease: DEPLOYMENT.release,
          actualInstallation: value.installationId,
        },
      );
    }
    for (const [name, expected] of Object.entries({
      mining: ADDRESSES.mining,
      token: ADDRESSES.token,
      collection: ADDRESSES.nft,
    })) {
      const actual = value.identities[name];
      if (
        actual !== undefined &&
        (typeof actual !== 'string' || actual.toLowerCase() !== expected.toLowerCase())
      )
        throw new SqueekKitError(
          'API_DEPLOYMENT_MISMATCH',
          `API ${name} identity does not match the SDK.`,
        );
    }
    return value;
  }
  async compatibility() {
    const raw = await this.get('/v1/core');
    try {
      const value = this.checked(raw);
      return {
        compatible: true as const,
        installationId: value.installationId,
        core: value.identities.core,
        safeThroughBlock: value.chain.safeThroughBlock,
      };
    } catch (error) {
      if (error instanceof SqueekKitError)
        return {
          compatible: false as const,
          code: error.code,
          reason: error.message,
          ...error.details,
        };
      throw error;
    }
  }
  async core() {
    return this.checked(await this.get('/v1/core'));
  }
  async settlements(range: 'now' | '24h' | '7d' = '24h') {
    requireInput(['now', '24h', '7d'].includes(range), 'Unsupported settlement range.');
    return this.checked(await this.get('/v1/settlements?range=' + range));
  }
  async ownerPage(owner: string, cursor?: string): Promise<OwnerPage> {
    const addr = address(owner);
    requireInput(
      !cursor || (/^[A-Za-z0-9_-]+$/.test(cursor) && cursor.length <= 4096),
      'Invalid pagination cursor.',
    );
    const raw = this.checked(
      await this.get(
        `/v1/owners/${addr}/squeeks?limit=100${cursor ? '&cursor=' + encodeURIComponent(cursor) : ''}`,
      ),
    );
    const parsed = ownerPage.safeParse(raw);
    if (!parsed.success)
      throw new SqueekKitError('API_SCHEMA', 'Owner response has invalid positions or pagination.');
    if (parsed.data.owner.toLowerCase() !== addr.toLowerCase())
      throw new SqueekKitError('API_SCHEMA', 'The API returned data for a different owner.');
    return parsed.data;
  }
  async portfolio(owner: string, maxPages = 10) {
    requireInput(
      Number.isInteger(maxPages) && maxPages >= 1 && maxPages <= 100,
      'Page limit must be between 1 and 100.',
    );
    const positions: OwnerPage['positions'] = [],
      cursors = new Set<string>(),
      ids = new Set<string>();
    let cursor: string | undefined, first: OwnerPage | undefined;
    for (let i = 0; i < maxPages; i++) {
      const page = await this.ownerPage(owner, cursor);
      first ??= page;
      if (
        page.chain.safeThroughBlock !== first.chain.safeThroughBlock ||
        page.chain.safeBlockHash !== first.chain.safeBlockHash ||
        page.installationId !== first.installationId
      )
        throw new SqueekKitError(
          'API_SCHEMA',
          'The portfolio changed snapshots during pagination. Start a fresh read.',
        );
      for (const item of page.positions) {
        if (ids.has(item.tokenId))
          throw new SqueekKitError('API_SCHEMA', 'API repeated an NFT across pages.');
        ids.add(item.tokenId);
        positions.push(item);
      }
      if (page.nextCursor === null)
        return {
          owner: page.owner,
          positions,
          source: {
            kind: 'api-display-only' as const,
            installationId: first.installationId,
            chain: first.chain,
          },
          sumOfIndividualClaimableBaseUnits: positions.reduce(
            (n, p) => n + BigInt(p.claimableBaseUnits),
            0n,
          ),
        };
      if (!page.nextCursor || cursors.has(page.nextCursor))
        throw new SqueekKitError(
          'API_SCHEMA',
          'API pagination repeated or returned an empty cursor.',
        );
      cursors.add(page.nextCursor);
      cursor = page.nextCursor;
    }
    throw new SqueekKitError(
      'PAGINATION_LIMIT',
      'Portfolio exceeds the page budget. No partial total is returned.',
    );
  }
}
