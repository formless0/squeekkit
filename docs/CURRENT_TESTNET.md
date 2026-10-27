# Current Sepolia app support — v0.2.0

Use `createCurrentTestnet()` for the economy used by https://sepolia.squeekchain.com/squeeks. This is explicit opt-in; the original `createSqueekKit()` remains unchanged.

## Source and trust boundary

The official app's JavaScript asset points to `https://green-dispenser-04.squeekchain.com` and includes the newer contract interfaces. We extracted only static ABI interface literals (no evaluation of downloaded JavaScript), cross-checked the API's identities against onchain links, captured the actual runtime code/proxy identities and configurations, and exercised the public contracts.

The pinned profile is `packages/sdk/src/generated/current/profile.json`. It includes source URL, asset SHA-256, observation block/hash, code hashes, implementations, versions/layouts, proxy administrators and owners, contract graph, and configuration. It is **a community-reviewed observation of the official app deployment**, not a manifest issued by the team and not an independent security audit. Code hashes prove continuity with the reviewed observation, not that the contracts themselves are safe.

Every chain operation verifies chain ID, the five contract runtime hashes, three proxy implementations/admins/governance owners, reported versions/layouts, graph links, configuration, collection maximum level and token decimals. Reads use one block and recheck its canonical hash. Any future code/configuration mismatch stops the operation; runtime discovery never replaces the pinned addresses.

| Contract     | Address                                      |
| ------------ | -------------------------------------------- |
| Core         | `0x2AeC8094Ed6840EFf95d284C55CD2585C4De6814` |
| Mining v8    | `0xac45fe7e42b8a0A44C02f9C8A507E137322Cff7a` |
| Staking v1   | `0x90112ED64E1A92aaf107736ACE9584b8745020eb` |
| Genesis NFTs | `0x05142852d9eaF3E66a7a74419e363Bd3539467B0` |
| SQK          | `0x1C0Df748AA3814a13FB1294C7f1088ECc7b9973A` |

## SDK operations

```ts
import { createCurrentTestnet } from '@squeekkit/sdk';
const current = createCurrentTestnet();
const state = await current.chain.protocol();
```

| Method                                       | Behavior                                                                                                                                                                                         |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `chain.verify()` / `chain.protocol()`        | Verify the pinned observation, then read current protocol state. `verificationBasis` explicitly says `observed-official-app`.                                                                    |
| `chain.account(owner)`                       | Account reward settlement, claimable SQK, actual claim recipient, account power, deposited SQK principal and wallet balances.                                                                    |
| `api.economy()` / `api.portfolio(owner)`     | Schema-v2 display data from the app API. Portfolio paginates completely, distinguishes wallet/deposited NFTs, and rejects missing/duplicate pages or changing snapshots. Default 20-page budget. |
| `chain.inspectSqueeks(owner, ids)`           | Direct ownership **or** staking custody plus matching depositor, level and next merge height.                                                                                                    |
| `chain.checkMerge(owner, survivor, donor)`   | Basic live eligibility for wallet or deposited NFTs. Contract simulation remains necessary.                                                                                                      |
| `chain.prepareClaim(owner)`                  | Simulate `claim(account)`, expose actual recipient, settlement-completeness flag and payout, and return an unsigned bundle. No NFT list.                                                         |
| `chain.prepareDeposit(owner, ids)`           | Check wallet custody and existing approvals; simulate NFT deposit. An absent approval yields `APPROVAL_REQUIRED`, never an automatic approval.                                                   |
| `chain.prepareWithdraw(owner, ids)`          | Check staking custody and depositor; simulate NFT withdrawal. This does not unstake SQK.                                                                                                         |
| `chain.prepareMerge(owner, survivor, donor)` | Wallet NFTs route to NFT `merge`; deposited NFTs route to staking `mergeDeposited`. Mixed custody fails. Preserve chosen order and show permanent donor burn.                                    |

Current rewards belong to an **account**, not each NFT. A claim may have bounded settlement: inspect `accountSettlementComplete` rather than assuming every unsettled entry was processed. A claim recipient can differ from the account; show it before wallet signing. All prepare calls re-read the chain independently of the API, simulate from the owner at a fresh block, recheck canonicality and enforce the existing five-block/180-second preparation freshness limit.

No keys, signing, broadcasting, automatic approvals, SQK staking/unstaking, clones or gacha are included. Nothing switches to mainnet by changing an RPC URL.

## Running the browser demo

Use `npm run dev`, or build and run `npm run preview -w @squeekkit/demo`. The local Vite dev/preview server provides a fixed-upstream, GET-only proxy for `/v1/economy/state` and validated `/v1/accounts/<address>` queries. This avoids depending on upstream browser-origin permissions. It forwards no cookies or authorization, accepts no arbitrary destination, and binds to loopback by default. Node SDK/MCP calls go directly to the public API.

For a hosted demo, supply the same controlled backend routes. Uploading only the static `dist` folder to an arbitrary host does not provide that proxy. Public RPC calls still originate in the browser; use a suitable provider if it rate limits.

## Live evidence

`npm run test:live:current` records protocol state, direct account reads, the complete 1,111-NFT public reserve portfolio, NFT inspection and unsigned claim/merge simulations. It exits nonzero if any operation fails. The successful recorded claim had a **zero** payout; the selected NFT merge simulation succeeded. These are actual public Sepolia responses, not fixture substitutions. See [the timestamped receipt](evidence/current-testnet-live.json).

Deposit/withdraw positive paths and failure cases are covered by explicitly synthetic fixture scenarios; they are not claimed as completed live transactions. No transaction was broadcast during verification. The default example wallet is the public protocol reserve, not a wallet controlled by SqueekKit.

The captured API and chain snapshots can have different source blocks. They are never combined to authorize an action. If the indexer changes snapshots during pagination, the SDK returns an error; the caller can request a fresh read.

## Updating this profile

Review official app/interface changes and onchain upgrade/configuration evidence, update the pin and provenance deliberately, add regression cases, rerun deterministic and live checks, and release a new package version. The capture helper is not a runtime trust mechanism. An official team-published deployment record should supersede this observation only after review.
