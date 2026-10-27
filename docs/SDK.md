# SDK reference

The package is ESM with TypeScript declarations. Build the workspace before importing `@squeekkit/sdk`.

For today's Sepolia app, use **`createCurrentTestnet()`**, `CurrentTestnetChain` and `CurrentTestnetApi`; see [the current profile and full method table](CURRENT_TESTNET.md). The API defaults to the same backend as the official Sepolia app. Chain options accept the same RPC/public-client settings below. These methods are account/depositor aware.

The remainder of this page documents **legacy `createSqueekKit()`**, the original developer-docs deployment. Its behavior and strict checks are retained for compatibility.

## Clients

```ts
const kit = createSqueekKit({
  chain: {
    rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
    confirmations: 12,
    // publicClient: existingViemPublicClient
  },
  api: {
    baseUrl: 'https://api.squeekchain.com',
    timeoutMs: 12000,
    retries: 1,
    // fetch: customFetch
  },
});
```

All fields are optional. The default public RPC may rate limit requests or prune history. Use a suitable operator-configured provider for production. Never include private RPC URLs in reports or source control. Callers may inject a viem `PublicClient` and `fetch` for testing.

## Onchain methods

| Method                                         | Result                                                                                                                                                          |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chain.verify({blockNumber?, confirmations?})` | Strictly verified `Snapshot`. All expected identities and configuration must match.                                                                             |
| `chain.protocol({blockNumber?})`               | Strict snapshot, core and mining state, token/NFT supply, reward-per-block constant, checkpoint readiness and unprocessed round count.                          |
| `chain.auditProtocol()`                        | Same diagnostic data after hard code/graph checks, with changed configuration recorded in `snapshot.configurationDrift`. `verified` is false when drift exists. |
| `chain.inspectSqueeks(owner, ids)`             | Explicit IDs, ownership, positions, per-ID claimable amounts and separately computed batch claimable amount.                                                    |
| `chain.checkMerge(owner, survivor, donor)`     | Current ownership plus eligibility, reasons, next level and a permanent-burn warning.                                                                           |
| `chain.prepareClaim(owner, ids)`               | Simulation at a freshly verified tip block, exact payout and an unsigned EIP-5792 call bundle.                                                                  |
| `chain.prepareMerge(owner, survivor, donor)`   | Eligibility + simulation + donor-burn warning and an unsigned EIP-5792 call bundle.                                                                             |

A snapshot includes chain ID, release, block number, block hash and timestamp. Onchain integers remain `bigint` where the ABI uses wide integers. Narrow ABI fields such as `level`, `pendingRound` and `nextMergeBlock` decode to exact JavaScript integers. `stringify()` converts `bigint` to decimal strings for JSON/MCP.

Claim IDs are validated, deduplicated and sorted. The raw input selection is limited to 32 entries; batching beyond that must be explicit. An unowned or invalid ID causes failure rather than partial completion. `checkMerge` and `prepareMerge` preserve the user's survivor/donor order.

Preparation always runs strict verification. It does not accept a previously supplied audit/snapshot. All reads and `eth_call` simulation use one fresh block, then its hash is checked again. A bundle is refused if the tip moved more than five blocks or the snapshot is more than 180 seconds old. This is an initial freshness check, not a guarantee of later inclusion: re-prepare before signing and verify the actual wallet receipt.

The SDK never connects a wallet, estimates financial returns, signs or broadcasts. A successful simulation can still fail later if ownership or state changes. The SDK does not automatically retry an alternative action after a revert.

## Display API methods

| Method                                    | Behavior                                                                                          |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `api.compatibility()`                     | Structured match/mismatch report from the core identity envelope. It does not switch deployments. |
| `api.core()`                              | Supported core response after envelope and identity validation.                                   |
| `api.settlements('now' \| '24h' \| '7d')` | Supported history response after envelope and identity validation.                                |
| `api.ownerPage(owner, cursor?)`           | One validated owner page (up to 100 entries).                                                     |
| `api.portfolio(owner, maxPages = 10)`     | Complete bounded portfolio, or an error. No misleading partial total.                             |

API responses retain decimal strings. A portfolio's `sumOfIndividualClaimableBaseUnits` is a display sum, not a simulated batch payout. It can differ from the combined onchain claim because of rounding.

Validation covers the identity envelope and fields consumed by the portfolio aggregator; additive API fields are preserved as untrusted data. This SDK does not claim exhaustive validation of every nested API extension. Core/settlement display data must not be fed into signing. Action methods use independent RPC reads.

Pagination rejects duplicate NFTs, repeated cursors and changes in installation, safe block or block hash. HTTP 409/cursor invalidation is returned to the caller, who should start a fresh read. Bounded conditional GET caching honors ETags. Retryable 429/503 responses wait for a `Retry-After` of at most five seconds within the retry count; longer delays are returned in structured error details rather than retried prematurely.

## Pure helpers

`evaluateMerge({survivorId, donorId, survivor, donor, height, maximumLevel})` explains rules without networking. It checks live positions, distinct IDs, matching levels, max level, pending activation and completed-block cooldowns. It does **not** verify ownership or simulate; use chain methods for a real action.

`tokenId`, `claimIds`, `address`, `formatAmount`, `stringify`, `jsonValue` and the four published ABIs are also exported. `formatAmount` is display-only and truncates to the chosen precision.

## Errors

`SqueekKitError` has `code`, `message` and `details`. Input, chain/deployment, ownership, merge, simulation, reorg, stale-state, HTTP, schema and pagination failures have distinct codes. Use `publicError(error)` at UI/logging boundaries; unrecognized provider exceptions are replaced with a generic message because provider errors may contain private endpoint credentials.

No mainnet, deposit/staking, mint or arbitrary execution methods are exposed in this version.
