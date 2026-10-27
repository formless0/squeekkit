# Builder contribution / WL submission draft

I built **SqueekKit**, a community TypeScript SDK, MCP server and interactive demo for Squeekchain.

Repository: https://github.com/formless0/squeekkit

The current Sepolia app adapter supports account rewards, complete wallet/deposited-NFT portfolios, direct custody/depositor checks, and unsigned claim, deposit, withdrawal and merge preparation. Nine current-app MCP tools share the same implementation; ten older tools preserve the deployment from the developer documentation separately.

It has reproducible tests and real Sepolia evidence: current contract verification, full public-reserve portfolio pagination, onchain reads and successful unsigned claim/merge simulations. No transaction was sent. The demo clearly separates recorded snapshots, live reads and simulations.

Because the developer manifest and live app target different deployments, the current profile documents its official-app interface source, observation block, code hashes and configuration. It never silently adopts new contracts from an API. This is a community-reviewed testnet profile, not a team-issued manifest or an independent security audit.

I'd welcome feedback on the deployment profile and which integrations would be most useful to other builders.

---

Draft only: no application or message has been sent. This does not claim endorsement, mainnet support or guaranteed WL eligibility.
