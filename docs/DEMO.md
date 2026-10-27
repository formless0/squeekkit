# Reviewer walkthrough

Run `npm ci`, `npm run build`, then `npm run dev`. The loopback server includes a read-only proxy for the current app API; no keys are needed.

1. **Current testnet:** the default screen shows a clearly labeled recorded snapshot. Click **Read live testnet** to verify code/configuration and read a real source block.
2. **Read portfolio:** the prefilled wallet is the public protocol reserve. The SDK loads all pages and distinguishes wallet/deposited NFTs. The captured example contains 1,111 NFTs; the UI renders the first 40 and includes all in JSON evidence. Counts are not inferred from that visible subset.
3. **Read account onchain:** see account rewards, claim recipient, stake and power directly from verified contracts.
4. **Inspect selected NFTs:** the default reserve IDs are 8889 and 8890. No claim of wallet control is made.
5. **Simulate selected merge:** preserves survivor/donor order and returns an unsigned bundle with a permanent-burn warning. Nothing is signed or sent. **Simulate account claim** takes the account, not a list of NFTs, and exposes its actual recipient and payout. The reserve's captured claim payout was zero.
6. **Overview / Wallet lab:** retained legacy deployment audit and clearly simulated older merge examples. These do not silently adopt the current app's contracts.
7. **MCP tools:** nineteen callable tools; current_app support uses the nine `current_testnet_*` names. The browser preview calls the shared SDK; the installable server runs the real MCP stdio protocol.

An assistant can be asked:

> Use current_testnet_status, then read my account and portfolio with the current_testnet tools. Explain wallet versus deposited NFTs, include the source block and do not sign or send anything.

See [current profile limits and provenance](CURRENT_TESTNET.md). This is an independent community toolkit, not an official SDK or a promise of whitelist selection.
