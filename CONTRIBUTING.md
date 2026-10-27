# Contributing

Use Node 22.12+. Run `npm ci` and `npm run check` before opening a pull request. UI changes should also run `npm run test:browser`; install Chromium with `npx playwright install chromium` first.

Keep protocol logic in `packages/sdk`; the demo and MCP layer should reuse it. Add meaningful tests for behavioral changes. Preserve full addresses in reports. Do not commit keys, `.env` files, private RPC URLs or user data.

Deployment support changes require a reviewed official source, a versioned manifest/ABI update, new or updated tests, and an updated compatibility report. Never auto-accept values discovered from a public API to bypass a failed identity check.

Report reproducible issues with the package version, chain/deployment, relevant block and sanitized error code. For vulnerabilities use the process in SECURITY.md.
