# Verification guide

## Deterministic tests

`npm run check` runs TypeScript checking, Vitest unit/integration tests, production builds, and a real MCP stdio smoke test. Tests do not depend on a live blockchain or mutate anything.

Coverage includes:

- Published runtime bytecode hashes, chain ID, implementation identity/version/layout, governance/graph links, configuration drift and canonical-block checks.
- One-block reads, bigint serialization and exact values above JavaScript's safe integer range.
- Owner-only preparation, explicit claim selection, zero rewards, sorted/deduplicated IDs, batch encoding and preserved survivor/donor order.
- Ineligible levels, absent positions, pending activation, completed-block cooldowns, simulation failures and stale preparation.
- HTTP 200/unavailable, schema errors, wrong deployments/owners, pagination loops, duplicate NFTs, shifting snapshots, missing pages and cursor invalidation.
- ETags, 304 behavior, bounded Retry-After handling, timeouts, invalid inputs and sanitized provider errors.
- Real MCP client/server discovery, schemas, SDK-backed responses, structured errors, resources/prompts and stdio process lifecycle.

`npm run test:coverage` writes line, statement, branch and function coverage under `coverage/`. Coverage is evidence of exercised code, not proof that contracts or integrations are bug-free.

## Fixture provenance

`tests/fixtures/rpc-reference.json` was captured from public Sepolia RPC reads. It contains real contract code, storage, graph reads and a block. The fixture helper deliberately restores the documented reporter and synthesizes positions, owners and reward amounts for controlled positive/negative tests. These synthetic responses are **not live-chain evidence**. The unmodified diagnostic capture is separately saved in `docs/evidence/reference-snapshot.json` and keeps the configuration mismatch visible.

## Browser regression suite

```sh
npx playwright install chromium
npm run test:browser
```

Desktop and mobile projects check provenance labeling, horizontal overflow, merge selection/eligibility, invalid-input behavior and navigation. CI runs the suite headlessly and uploads reports. Live public endpoints are deliberately excluded from these deterministic browser tests. Interactive browser checks separately exercise the actual live audit and error paths.

## Live checks

`npm run test:live` runs strict verification, a diagnostic audit, and API compatibility. It saves a timestamped report and **fails if strict verification fails**, even if diagnostic reads succeed. This is intentional while the published record differs from current configuration. No key, signature or transaction is used.

`node scripts/capture-reference.mjs` refreshes the recorded audit and RPC fixture capture. Review the diff and provenance before committing it; this does not automatically update the trusted manifest. The default provider may not retain old blocks.

## Limits

- No mainnet transactions, real claims or real NFT merges were submitted during verification.
- RPC fixture tests cannot establish how an unreviewed future contract upgrade behaves.
- Passing simulation cannot guarantee a later transaction; state can change before inclusion.
- Code identity checks for the proxies use published runtime hashes. Immutable token/NFT checks use pinned addresses, deployed-code presence and graph links because the manifest does not publish runtime hashes for those contracts.
