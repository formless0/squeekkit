# Sources and attribution

SqueekKit is an independent community project. It is not an official Squeekchain SDK and is not endorsed by Squeekchain.

- `packages/sdk/src/generated/current/abis.ts` contains a selected subset of ABI interface definitions extracted as static literals from the official Sepolia frontend. No downloaded JavaScript is evaluated or redistributed. The source URL and SHA-256 are recorded in the adjacent `profile.json`; runtime identities are public chain observations, not a team-issued manifest. Upstream interfaces remain attributable to Squeekchain and are not relicensed by the project MIT license.

- The contract interface JSON files and Sepolia deployment record in `packages/sdk/src/generated/` were retrieved from [Squeekchain's published developer assets](https://docs.squeekchain.com/developers/). Source URLs, retrieval time and SHA-256 digests are recorded in `provenance.json`. These interface definitions and deployment facts remain attributable to Squeekchain; SqueekKit's MIT license does not relicense upstream material.
- Contract behavior is implemented against the [Quickstart](https://docs.squeekchain.com/developers/quickstart/), [Owner actions](https://docs.squeekchain.com/developers/owner-actions/), [API](https://docs.squeekchain.com/developers/api/) and contract references. This repository does not redistribute the documentation prose or contract source.
- The MCP implementation uses the official [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk), under its upstream MIT license.
- viem, React, Vite, Zod, Lucide, Vitest, Playwright and other dependencies retain their respective licenses. See their installed packages and the lockfile.
- DM Sans and Space Grotesk are bundled through Fontsource and retain their SIL Open Font License notices in those packages.
- Pixel hamster artwork and demo layout were created for this project; no Squeek NFT art or official logo was copied.
- `tests/fixtures/rpc-reference.json` contains public Ethereum Sepolia RPC responses. Test helpers explicitly synthesize values for controlled scenarios; fixture data is never labeled live.
