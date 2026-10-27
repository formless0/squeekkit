# Two-minute reviewer walkthrough

Run `npm ci`, `npm run build`, then `npm run dev`. Open the URL Vite prints.

1. **Overview:** see the saved public audit and its source block. It is explicitly labeled recorded. Expand “Inspect deployment evidence” to see the exact reporter mismatch and full addresses.
2. **Check live:** makes real public RPC/API requests. The diagnostic read keeps the mismatch visible; it never claims full manifest verification when configuration differs. Network failures leave the recorded label intact.
3. **Wallet lab → Simulated example:** inspect the two invented NFTs. Preview the merge and see the exact survivor/donor consequences. Swap roles. Toggle cooldown or pending power: preview becomes disabled and explains why.
4. **Wallet lab → Onchain inspection:** enter an address and explicit IDs. Invalid addresses fail before networking. A currently mismatched manifest blocks strict reads and unsigned preparation; no wallet opens and nothing is sent.
5. **MCP tools:** explore the ten tools. “Run SDK preview” calls the same SDK operation the actual MCP server uses. This browser panel is not an AI chat and is not pretending to run a model.
6. **Quickstart:** copy installation commands and MCP configuration. `npm run test:mcp` demonstrates actual stdio initialization, discovery, resource reads, prompt discovery and input rejection.

For an assistant demonstration, connect the built MCP server and ask:

> Audit the documented Squeekchain deployment. Include the source block and explain any configuration mismatch. Do not prepare or send a transaction.

Then ask:

> Check whether the public API serves the same deployment. Explain why an unavailable or mismatched response must not be shown as zero rewards.

Positive owner-action simulation is reproducible in fixture integration tests. See the compatibility report before attempting real preparation. These tools are a contribution for integration quality, not a claim of protocol endorsement or whitelist selection.
