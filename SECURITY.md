# Security model

SqueekKit reads public state and prepares unsigned calls. It does not hold keys, sign, broadcast, accept arbitrary execution targets, provide an autonomous keeper, or expose a public HTTP MCP endpoint.

Strict verification pins chain ID, proxy addresses and implementations, runtime hashes, layout/version, proxy-admin ownership, graph links, core configuration and collection policy. Checks run at one block; reorgs invalidate results. The optional diagnostic audit reports configuration drift and cannot be reused to authorize preparation.

Owners must choose exact NFT IDs for NFT operations. Current-app claims use an account and report its actual recipient; legacy claims use selected NFT IDs. Merges permanently destroy the donor. Deposits change NFT custody and require existing approvals; the toolkit does not grant approvals. The final wallet should display the call target, network, recipient, IDs and irreversible effects, request owner confirmation, re-prepare against current state, and verify the actual confirmed receipt. Read-only tool annotations describe server side effects, not the consequences of a transaction a user may later sign.

An address is public information, not authentication. Do not infer ownership from someone typing an address. Provider URLs can contain secrets: keep them in protected client configuration and use `publicError()` at public logging boundaries. External metadata and error strings are untrusted data and must not be executed or injected as HTML.

This release has tests but no independent security audit. It supports two explicitly separate Sepolia profiles, not mainnet or unknown upgrades. The legacy profile uses published deployment records. The current-app profile uses static interfaces from the official app and community-observed code/configuration pins; that evidence is not an official manifest or endorsement. The public display API has independent freshness and compatibility limits and never supplies transaction-preparation inputs.

The demo's loopback development/preview server proxies only fixed, read-only routes to the current public API. It does not forward cookies or authorization, accept arbitrary upstream URLs, or expose transaction submission. Hosting the demo elsewhere requires configuring a controlled backend; a static-file upload alone does not provide that proxy.

For a suspected vulnerability, use the repository's private vulnerability reporting feature if available. Otherwise open an issue requesting a private reporting channel without including exploit details, credentials or private data. Do not post secrets in issues.
