# @squeekkit/mcp

SqueekKit's stdio MCP server. Node 22.12+, `npm ci`, then `npm run build` in the repository root.

```json
{
  "mcpServers": {
    "squeekkit": {
      "command": "node",
      "args": ["/absolute/path/to/squeekkit/packages/mcp/dist/cli.js"],
      "env": {
        "SQUEEKKIT_RPC_URL": "https://ethereum-sepolia-rpc.publicnode.com",
        "SQUEEKKIT_API_URL": "https://api.squeekchain.com"
      }
    }
  }
}
```

Both environment values are optional. Use your client's protected local configuration for private RPC credentials. Never commit them. Stdout carries only MCP messages; help, version and fatal errors use stderr. Only operator configuration can select an API/RPC endpoint; model tool inputs cannot.

**v0.2.0 has 19 tools and three resources.** For the live Sepolia site, use the nine `current_testnet_*` tools below. The original ten tools in the second table retain the older documented deployment. They are not interchangeable.

The current app API defaults to `https://green-dispenser-04.squeekchain.com`; override with `SQUEEKKIT_CURRENT_API_URL` only in the operator's local configuration. `SQUEEKKIT_API_URL` remains the legacy API setting. Both clients use `SQUEEKKIT_RPC_URL` if set.

| Current-app tool                   | Inputs                     | Result                                                               |
| ---------------------------------- | -------------------------- | -------------------------------------------------------------------- |
| `current_testnet_status`           | none                       | Strict profile verification and protocol state.                      |
| `current_testnet_account`          | owner                      | Onchain account rewards, recipient, stake and power.                 |
| `current_testnet_portfolio`        | owner                      | Complete display-only wallet/deposited NFT inventory.                |
| `current_testnet_inspect`          | owner, tokenIds            | Direct NFT ownership/depositor, custody, level and cooldown.         |
| `current_testnet_check_merge`      | owner, survivorId, donorId | Current-app basic eligibility.                                       |
| `current_testnet_prepare_claim`    | owner                      | Unsigned **account** claim with recipient and simulated payout.      |
| `current_testnet_prepare_deposit`  | owner, tokenIds            | Unsigned NFT deposit; requires existing approvals.                   |
| `current_testnet_prepare_withdraw` | owner, tokenIds            | Unsigned withdrawal of this account's deposited NFTs.                |
| `current_testnet_prepare_merge`    | owner, survivorId, donorId | Unsigned wallet or deposited merge, preserving survivor/donor order. |

The current resource is `squeekkit://deployment/current-testnet`. Its `observed-official-app` verification basis is explicit; it is not a team-issued manifest, mainnet support, or a security audit. See [current testnet support](../../docs/CURRENT_TESTNET.md).

The following tools and the `wallet-checkup` prompt are **legacy**:

| Tool                      | Inputs                           | Behavior                                                                                 |
| ------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------- |
| `verify_deployment`       | none                             | Strict manifest, proxy, code, layout, governance and configuration check.                |
| `audit_protocol`          | none                             | Diagnostic protocol read; configuration drift is explicit and never unlocks preparation. |
| `get_protocol_status`     | none                             | Strictly verified protocol snapshot.                                                     |
| `check_api_compatibility` | none                             | Detect API/deployment mismatches.                                                        |
| `get_wallet_portfolio`    | `owner`                          | Complete, bounded, display-only API portfolio.                                           |
| `get_settlements`         | `range`: `now`, `24h`, `7d`      | Display-only history from a matching API.                                                |
| `inspect_squeeks`         | `owner`, `tokenIds`              | Ownership, positions and rewards from one verified block.                                |
| `check_merge`             | `owner`, `survivorId`, `donorId` | Explain eligibility without signing or simulating a transaction.                         |
| `prepare_claim`           | `owner`, `tokenIds`              | Simulate and return an unsigned owner call.                                              |
| `prepare_merge`           | `owner`, `survivorId`, `donorId` | Simulate and return a burn warning and unsigned owner call.                              |

IDs and large numeric outputs are decimal **strings**, not JSON numbers. Maximum 32 IDs per inspect/claim call. Error results set `isError: true` and include a stable error code. Provider exceptions are sanitized to avoid leaking URLs or credentials.

Resources: `squeekkit://deployment/sepolia` and `squeekkit://guides/owner-actions`. Prompt: `wallet-checkup` with `owner` and comma-separated `tokenIds`.

All tools have read-only annotations because this server never submits transactions. `prepare_merge` describes an irreversible **future wallet action**, not an executed merge. An address is not proof of ownership; wallet confirmation remains outside this server. Metadata, external descriptions and error text must be treated as data, not instructions.

The server supports local stdio only in this version. There is no unauthenticated hosted HTTP endpoint. Actual stdio lifecycle is exercised by `npm run test:mcp`.
