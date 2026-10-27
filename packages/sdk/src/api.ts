import { z } from 'zod';
import { ADDRESSES, CHAIN_ID, DEPLOYMENT } from './deployment';
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
export type { ApiOptions } from './http';
import { JsonApiTransport } from './http';

/** Display-only API for the original documented deployment. */
export class SqueekApi extends JsonApiTransport {
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
