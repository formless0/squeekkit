import { test, expect } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from '../packages/mcp/src/server';
import { SqueekChain, SqueekApi } from '../packages/sdk/src';
import { chainFixture, OWNER } from './fixtures/chain';
test('MCP protocol integration uses the real SDK for tools, schema validation and errors', async () => {
  const fixture = chainFixture();
  const server = createServer({
    chain: new SqueekChain({ publicClient: fixture.client }),
    api: new SqueekApi({ fetch: async () => Response.json({ status: 'unavailable' }) }),
  });
  const client = new Client({ name: 'integration-test', version: '1' });
  const [a, b] = InMemoryTransport.createLinkedPair();
  try {
    await Promise.all([server.connect(a), client.connect(b)]);
    const listed = await client.listTools();
    expect(listed.tools).toHaveLength(10);
    expect(listed.tools.every((t) => t.annotations?.readOnlyHint === true)).toBe(true);
    for (const name of [
      'verify_deployment',
      'audit_protocol',
      'get_protocol_status',
      'check_api_compatibility',
    ]) {
      const response = await client.callTool({ name, arguments: {} });
      expect(response.isError).not.toBe(true);
    }
    const inspection = await client.callTool({
      name: 'inspect_squeeks',
      arguments: { owner: OWNER, tokenIds: ['8889'] },
    });
    expect(inspection.isError).not.toBe(true);
    const check = await client.callTool({
      name: 'check_merge',
      arguments: { owner: OWNER, survivorId: '8889', donorId: '8890' },
    });
    expect(check.structuredContent).toMatchObject({ eligible: true });
    const claim = await client.callTool({
      name: 'prepare_claim',
      arguments: { owner: OWNER, tokenIds: ['8889'] },
    });
    expect(claim.structuredContent).toMatchObject({ needsWalletSignature: true });
    const history = await client.callTool({ name: 'get_settlements', arguments: { range: '24h' } });
    expect(history.isError).toBe(true);
    const result = await client.callTool({
      name: 'prepare_merge',
      arguments: { owner: OWNER, survivorId: '8889', donorId: '8890' },
    });
    expect(result.isError).not.toBe(true);
    expect(result.structuredContent).toMatchObject({ needsWalletSignature: true, donorId: '8890' });
    expect(JSON.stringify(result)).toContain('burned permanently');
    const bad = await client.callTool({
      name: 'prepare_claim',
      arguments: { owner: OWNER, tokenIds: ['-1'] },
    });
    expect(bad.isError).toBe(true);
    const unavailable = await client.callTool({
      name: 'get_wallet_portfolio',
      arguments: { owner: OWNER },
    });
    expect(unavailable.isError).toBe(true);
    expect(unavailable.structuredContent).toMatchObject({ code: 'API_UNAVAILABLE' });
    const resources = await client.listResources();
    expect(resources.resources).toHaveLength(2);
    for (const item of resources.resources) {
      const resource = await client.readResource({ uri: item.uri });
      expect(resource.contents.length).toBeGreaterThan(0);
    }
    const prompt = await client.getPrompt({
      name: 'wallet-checkup',
      arguments: { owner: OWNER, tokenIds: '8889,8890' },
    });
    expect(JSON.stringify(prompt)).toContain('Do not sign');
    expect(fixture.calls.some((c) => /send|sign/i.test(c.method))).toBe(false);
  } finally {
    await client.close();
    await server.close();
  }
});
