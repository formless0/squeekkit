import { z } from 'zod';
import { CURRENT_TESTNET as profile, CURRENT_ADDRESSES as A } from './current-profile';
import { JsonApiTransport, type ApiOptions } from './http';
import { address } from './utils';
import { requireInput, SqueekKitError } from './errors';
const uint = z
  .string()
  .regex(/^(0|[1-9]\d*)$/)
  .max(78);
const addr = z.string().regex(/^0x[\da-f]{40}$/i);
const hash = z.string().regex(/^0x[\da-f]{64}$/i);
const proxy = z
  .object({
    proxy: addr,
    implementation: addr,
    implementationVersion: uint,
    storageLayoutDigest: hash,
  })
  .passthrough();
const envelope = z
  .object({
    schemaVersion: z.literal(2),
    status: z.literal('available'),
    installationId: z.string(),
    generatedAt: z.string(),
    release: z.object({
      id: z.string(),
      protocolRevision: z.string(),
      rewardModelRevision: z.string(),
    }),
    chain: z
      .object({
        chainId: z.literal('11155111'),
        safeThroughBlock: uint,
        safeBlockHash: hash,
        safeBlockTimestamp: z.string(),
      })
      .passthrough(),
    identities: z
      .object({
        core: addr,
        token: addr,
        genesis: addr,
        mining: proxy,
        staking: proxy,
        launch: addr,
      })
      .passthrough(),
  })
  .passthrough();
const token = z
  .object({
    tokenId: uint,
    custody: z.enum(['wallet', 'staking']),
    level: z.number().int().min(1).max(10),
    basePower: uint.nullable(),
    nextMergeHeight: uint,
    mergeState: z.enum(['ready', 'cooldown', 'terminal', 'mining_unavailable']),
  })
  .passthrough();
const accountSchema = envelope
  .extend({
    account: addr,
    claim: z
      .object({ claimableBaseUnits: uint, complete: z.boolean(), budget: uint })
      .passthrough(),
    stake: z.object({
      principalBaseUnits: uint,
      freshBaseUnits: uint,
      matureBaseUnits: uint,
      freshUntilRound: uint,
    }),
    tokens: z.array(token),
    tokenCounts: z.object({ wallet: uint, staking: uint }),
    nextCursor: z.string().nullable(),
  })
  .passthrough();
const economySchema = envelope
  .extend({
    supply: z.object({ liveSupplyBaseUnits: uint, paidBaseUnits: uint }).passthrough(),
    nft: z.object({ live: uint, issued: uint, burned: uint }).passthrough(),
    mining: z
      .object({ processedThroughRound: uint, totalNftPower: uint, totalSqkPower: uint })
      .passthrough(),
  })
  .passthrough();
export type CurrentAccountPage = z.infer<typeof accountSchema>;
/** Display only. Current chain preparation never consumes these responses. */
export class CurrentTestnetApi extends JsonApiTransport {
  constructor(options: ApiOptions = {}) {
    super({ ...options, baseUrl: options.baseUrl ?? profile.apiBase });
  }
  private checked(raw: unknown) {
    if (raw && typeof raw === 'object' && 'status' in raw && raw.status === 'unavailable')
      throw new SqueekKitError('API_UNAVAILABLE', 'Current testnet data is unavailable, not zero.');
    const parsed = envelope.safeParse(raw);
    if (!parsed.success)
      throw new SqueekKitError('API_SCHEMA', 'Unsupported current-app API envelope.');
    const v = parsed.data;
    const checks: [unknown, unknown][] = [
      [v.installationId, profile.installationId],
      [v.release.id, profile.release.id],
      [v.release.protocolRevision, profile.release.protocolRevision],
      [v.release.rewardModelRevision, profile.release.rewardModelRevision],
      [v.identities.core, A.core],
      [v.identities.token, A.token],
      [v.identities.genesis, A.nft],
      [v.identities.launch, profile.links['staking.launch']],
    ];
    for (const name of ['mining', 'staking'] as const) {
      const actual = v.identities[name],
        expected = profile.contracts[name];
      checks.push(
        [actual.proxy, expected.address],
        [actual.implementation, expected.implementation],
        [actual.implementationVersion, expected.version],
        [actual.storageLayoutDigest, expected.layout],
      );
    }
    if (checks.some(([a, b]) => String(a).toLowerCase() !== String(b).toLowerCase()))
      throw new SqueekKitError(
        'API_DEPLOYMENT_MISMATCH',
        'The API does not match the pinned current-app profile.',
      );
    return v;
  }
  async economy() {
    const value = this.checked(await this.get('/v1/economy/state'));
    const parsed = economySchema.safeParse(value);
    if (!parsed.success) throw new SqueekKitError('API_SCHEMA', 'Malformed economy totals.');
    return parsed.data;
  }
  async accountPage(owner: string, cursor?: string): Promise<CurrentAccountPage> {
    const from = address(owner);
    requireInput(
      !cursor || (/^[A-Za-z0-9_-]+$/.test(cursor) && cursor.length <= 4096),
      'Invalid cursor.',
    );
    const value = this.checked(
      await this.get(
        `/v1/accounts/${from}?limit=100${cursor ? '&cursor=' + encodeURIComponent(cursor) : ''}`,
      ),
    );
    const parsed = accountSchema.safeParse(value);
    if (!parsed.success) throw new SqueekKitError('API_SCHEMA', 'Malformed account portfolio.');
    if (parsed.data.account.toLowerCase() !== from.toLowerCase())
      throw new SqueekKitError('API_SCHEMA', 'The API returned a different account.');
    return parsed.data;
  }
  async portfolio(owner: string, maxPages = 20) {
    requireInput(
      Number.isInteger(maxPages) && maxPages > 0 && maxPages <= 100,
      'Page budget must be between 1 and 100.',
    );
    let first: CurrentAccountPage | undefined, cursor: string | undefined;
    const tokens: CurrentAccountPage['tokens'] = [],
      ids = new Set<string>(),
      cursors = new Set<string>();
    for (let pageNumber = 0; pageNumber < maxPages; pageNumber++) {
      const page = await this.accountPage(owner, cursor);
      first ??= page;
      if (
        page.chain.safeThroughBlock !== first.chain.safeThroughBlock ||
        page.chain.safeBlockHash !== first.chain.safeBlockHash ||
        page.tokenCounts.wallet !== first.tokenCounts.wallet ||
        page.tokenCounts.staking !== first.tokenCounts.staking
      )
        throw new SqueekKitError(
          'API_SCHEMA',
          'Account pagination changed snapshots. Restart the read.',
        );
      for (const t of page.tokens) {
        if (ids.has(t.tokenId))
          throw new SqueekKitError('API_SCHEMA', 'Duplicate NFT across account pages.');
        ids.add(t.tokenId);
        tokens.push(t);
      }
      if (page.nextCursor === null) {
        const wallet = tokens.filter((t) => t.custody === 'wallet').length,
          staking = tokens.length - wallet;
        if (
          BigInt(wallet) !== BigInt(first.tokenCounts.wallet) ||
          BigInt(staking) !== BigInt(first.tokenCounts.staking)
        )
          throw new SqueekKitError('API_SCHEMA', 'Account pagination ended with missing NFTs.');
        return {
          source: {
            kind: 'api-display-only' as const,
            profileId: profile.id,
            release: profile.release.id,
            chain: first.chain,
          },
          account: first.account,
          claim: first.claim,
          stake: first.stake,
          tokenCounts: first.tokenCounts,
          tokens,
        };
      }
      if (!page.nextCursor || cursors.has(page.nextCursor))
        throw new SqueekKitError('API_SCHEMA', 'Account pagination repeated a cursor.');
      cursors.add(page.nextCursor);
      cursor = page.nextCursor;
    }
    throw new SqueekKitError(
      'PAGINATION_LIMIT',
      'Account exceeds the page budget. No partial portfolio is returned.',
    );
  }
}
