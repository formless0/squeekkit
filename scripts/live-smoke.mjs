import { createSqueekKit, DEPLOYMENT, publicError, stringify } from '../packages/sdk/dist/index.js';
import fs from 'node:fs/promises';
const kit = createSqueekKit({
  chain: { rpcUrl: process.env.SQUEEKKIT_RPC_URL },
  api: { baseUrl: process.env.SQUEEKKIT_API_URL },
});
const report = {
  checkedAt: new Date().toISOString(),
  release: DEPLOYMENT.release,
  actions: 'Read-only; no transactions sent',
  checks: {},
};
for (const [name, fn] of Object.entries({
  protocol: () => kit.chain.protocol(),
  audit: () => kit.chain.auditProtocol(),
  apiCompatibility: () => kit.api.compatibility(),
})) {
  try {
    report.checks[name] = { ok: true, result: await fn() };
  } catch (error) {
    report.checks[name] = { ok: false, error: publicError(error) };
  }
}
await fs.mkdir('docs/evidence', { recursive: true });
await fs.writeFile('docs/evidence/live-verification.json', stringify(report) + '\n');
console.log(stringify(report));
if (!report.checks.protocol.ok) process.exitCode = 1;
