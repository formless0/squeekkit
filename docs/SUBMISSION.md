# Builder contribution / WL submission draft

I built **SqueekKit**, an open-source community SDK and MCP server for Squeekchain, with an interactive demo and reproducible tests.

Repository: https://github.com/formless0/squeekkit

It packages the documented integration rules into shared TypeScript operations: deployment checks, one-block reads, exact integer rewards, owner/merge eligibility, and unsigned claim/merge preparation. A ten-tool MCP server lets assistants use those same operations without handling keys or sending transactions.

The demo includes a real recorded Sepolia audit, live compatibility checks and a clearly labeled simulated merge lab. Tests exercise positive and negative paths, the actual MCP stdio protocol, and desktop/mobile UI behavior.

While building it, I found that the documented reporter differs from current onchain configuration, and the public API serves a different core deployment. The toolkit makes both mismatches explicit and blocks transaction preparation rather than silently switching addresses. Those findings, source blocks and reproduction steps are included in the repository.

I'd welcome feedback on the supported deployment record and the most useful integrations for other builders. This is an independent community contribution, not an official SDK.

---

This is a draft for the owner to submit. No application or message has been sent to the Squeekchain team. It does not claim endorsement, production readiness across unverified deployments, or guaranteed WL eligibility.
