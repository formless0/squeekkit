import fs from 'node:fs/promises';
import { createPublicClient, http, toHex } from 'viem';
import {
  createCurrentTestnet,
  CURRENT_TESTNET,
  stringify,
  publicError,
} from '../packages/sdk/dist/index.js';
const records = [];
const client = createPublicClient({
  transport: (opts) => {
    const base = http(
      process.env.SQUEEKKIT_RPC_URL ?? 'https://ethereum-sepolia-rpc.publicnode.com',
      { batch: { batchSize: 25, wait: 10 }, timeout: 20000, retryCount: 1 },
    )(opts);
    return {
      ...base,
      request: async (args) => {
        const result = await base.request(args);
        records.push({ ...args, result });
        return result;
      },
    };
  },
});
const kit = createCurrentTestnet({ chain: { publicClient: client } });
// Public protocol reserve. No claim of control, no signature and no broadcast.
const owner = CURRENT_TESTNET.links['nft.protocolRecipient'];
const report = {
  checkedAt: new Date().toISOString(),
  profile: CURRENT_TESTNET.id,
  actions: 'Read and eth_call simulation only. No signatures or transactions.',
  ownerRole: 'Public protocol reserve',
  checks: {},
};
const jobs = {
  protocol: () => kit.chain.protocol(),
  account: () => kit.chain.account(owner),
  economy: () => kit.api.economy(),
  portfolio: () => kit.api.portfolio(owner),
  inspect: () => kit.chain.inspectSqueeks(owner, ['8889', '8890']),
  merge: () => kit.chain.prepareMerge(owner, '8889', '8890'),
  claim: () => kit.chain.prepareClaim(owner),
};
for (const [name, fn] of Object.entries(jobs)) {
  try {
    const result = await fn();
    report.checks[name] = { ok: true, result };
    console.log(name, 'PASS');
  } catch (error) {
    report.checks[name] = { ok: false, error: publicError(error) };
    console.log(name, stringify(publicError(error)));
  }
}
await fs.writeFile('docs/evidence/current-testnet-live.json', stringify(report) + '\n');
if (process.argv.includes('--capture') && report.checks.protocol.ok) {
  const bn = report.checks.protocol.result.snapshot.blockNumber;
  await fs.writeFile(
    'tests/fixtures/current-rpc-reference.json',
    stringify({ blockNumber: toHex(bn), records }) + '\n',
  );
  await fs.writeFile(
    'apps/demo/src/current-reference.json',
    stringify({
      kind: 'recorded-current-testnet',
      capturedAt: report.checkedAt,
      protocol: report.checks.protocol.result,
    }) + '\n',
  );
}
if (Object.values(report.checks).some((v) => !v.ok)) process.exitCode = 1;
