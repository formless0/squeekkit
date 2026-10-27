import { test, expect } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from '../packages/mcp/src/server';
import { createCurrentTestnet } from '../packages/sdk/src';
import {
  currentFixture,
  CURRENT_OWNER as owner,
  type CurrentFixtureOptions,
} from './fixtures/current';
import { currentPage } from './fixtures/current-api';
test('all nine current MCP tools call the current SDK with structured results and no broadcasts', async () => {
  const options: CurrentFixtureOptions = {},
    f = currentFixture(options);
  const current = createCurrentTestnet({
    chain: { publicClient: f.client },
    api: { fetch: async () => Response.json(currentPage()) },
  });
  const server = createServer(undefined, current),
    client = new Client({ name: 'current-test', version: '1' });
  const [a, b] = InMemoryTransport.createLinkedPair();
  try {
    await Promise.all([server.connect(a), client.connect(b)]);
    const jobs = [
      ['current_testnet_status', {}],
      ['current_testnet_account', { owner }],
      ['current_testnet_portfolio', { owner }],
      ['current_testnet_inspect', { owner, tokenIds: ['8889'] }],
      ['current_testnet_check_merge', { owner, survivorId: '8889', donorId: '8890' }],
      ['current_testnet_prepare_claim', { owner }],
      ['current_testnet_prepare_deposit', { owner, tokenIds: ['8889'] }],
      ['current_testnet_prepare_merge', { owner, survivorId: '8890', donorId: '8889' }],
    ] as const;
    for (const [name, args] of jobs) {
      const r = await client.callTool({ name, arguments: args });
      expect(r.isError, name).not.toBe(true);
      expect(r.structuredContent).toBeDefined();
    }
    options.deposited = true;
    expect(
      (
        await client.callTool({
          name: 'current_testnet_prepare_withdraw',
          arguments: { owner, tokenIds: ['8889'] },
        })
      ).isError,
    ).not.toBe(true);
    const bad = await client.callTool({
      name: 'current_testnet_inspect',
      arguments: { owner, tokenIds: ['0'] },
    });
    expect(bad.isError).toBe(true);
    options.wrongCode = true;
    const drift = await client.callTool({
      name: 'current_testnet_prepare_claim',
      arguments: { owner },
    });
    expect(drift.isError).toBe(true);
    expect(drift.structuredContent).toMatchObject({ code: 'DEPLOYMENT_MISMATCH' });
    expect(f.calls.some((c) => /send|sign/i.test(c.method))).toBe(false);
  } finally {
    await client.close();
    await server.close();
  }
});
