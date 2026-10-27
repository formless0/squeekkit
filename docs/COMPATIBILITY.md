# Deployment compatibility report

Checked October 27, 2026. This is a point-in-time report, not a monitor.

**v0.2.0:** this report describes the retained **legacy developer-docs profile**. The separate `createCurrentTestnet()` client supports the live Sepolia app and passed current reads and unsigned simulations. See [CURRENT_TESTNET.md](CURRENT_TESTNET.md). No legacy verification was disabled to add it.

## Supported record

- Official record: https://docs.squeekchain.com/assets/deployments/sepolia.json
- Release: `squeeks-sepolia-core3-mining6-001`
- Chain: Sepolia, `11155111`
- Core: `0x74665dAecA35A2303e767E76a2FF1FB6F93e119f`
- Mining: `0x3beE588fC20dE788Bac17d33b41Da7346cb27EC4`
- SQK: `0x6872bfa5ccc3e9e440c6c16e5ffdabb8dba4cc76`
- NFT: `0x0eAF3E0d40A0a8E5a6Ac030b2459E9FB0B7905c6`

The downloaded interface and manifest hashes are in `packages/sdk/src/generated/provenance.json`.

## Observed configuration drift

The documented core's proxy implementation, runtime hash, layout digest, version, proxy admin, governing owner and contract graph passed the diagnostic checks. Its reporter was:

- Manifest: `0xA663b5C05eAFa3e90bFbD3F7DEcdaaa3d41F5A75`
- Onchain: `0xB317AB7Cc24fD5d94EA120B3b189bc6527a7d0Aa`

This is a configuration mismatch, **not evidence of an exploit or proof of malicious activity**. Reporter rotation can be legitimate. The bundled official record has not been updated to match it, so strict checks stop.

The saved diagnostic snapshot is Ethereum block **12004460**, hash `0xc100d8bc9dcf391c377cbf1f1535eaebe8e932a433999133f29e32b4d7b39d0b`. [Explorer block](https://eth-sepolia.blockscout.com/block/12004460). It reports `verified: false`. See [reference-snapshot.json](evidence/reference-snapshot.json).

## API drift

`GET https://api.squeekchain.com/v1/core` was available but reported installation `stream-game-sepolia-test-20261025-01`, with core `0x980b4424c007caf7a1f3670b48c8eaef7ebc3d44`. This differs from the pinned official graph. The documented `/v1/mining/state` endpoint returned HTTP 404.

SqueekKit therefore rejects cross-deployment economy data. It does not infer that a wallet owns zero NFTs or has zero rewards. The owner API may also be unavailable; direct identity checks remain independent.

## What works now

- Diagnostic reads of the pinned graph, with configuration differences visible.
- API compatibility reporting.
- Offline pure merge checks and the explicitly simulated demo lab.
- SDK/MCP integration, unsigned call encoding and positive/negative action paths in controlled fixture tests.

Strict current reads and preparation will stay blocked until a reviewed official record matches the chain. No successful current-network claim or merge is claimed, and no transaction was signed or sent.

## How to update support

1. Obtain an updated official deployment/ABI record from the protocol maintainers.
2. Review chain ID, addresses, implementation hashes, layouts, governance, configuration and collection policy.
3. Update the pinned generated files and their hashes together; add version-specific decoding if needed.
4. Re-run deterministic tests and the live smoke check. Review every changed expectation rather than accepting observed values automatically.
5. Publish a versioned release and document migration behavior.

Do not disable verification, substitute an explorer address, or reuse an older ABI merely because a function selector matches. An external API is not an authority for transaction destinations.

## History availability

The default public RPC prunes historical state. An attempt to reproduce the older documentation example at block 11916994 returned a pruned-history error. SqueekKit records the current diagnostic audit instead of representing an unverified old snapshot as a pass. Consumers needing old reads must supply an archive-capable RPC.
