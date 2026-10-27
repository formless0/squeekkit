import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
const transport = new StdioClientTransport({
  command: process.execPath,
  args: ['packages/mcp/dist/cli.js'],
  stderr: 'pipe',
});
const client = new Client({ name: 'squeekkit-smoke', version: '0.2.0' });
try {
  await client.connect(transport);
  const tools = await client.listTools();
  assert.equal(tools.tools.length, 19);
  const resources = await client.listResources();
  assert.equal(resources.resources.length, 3);
  const deployment = await client.readResource({ uri: 'squeekkit://deployment/sepolia' });
  assert.equal(JSON.parse(deployment.contents[0].text).chainId, 11155111);
  const bad = await client.callTool({
    name: 'inspect_squeeks',
    arguments: { owner: 'not-an-address', tokenIds: ['1'] },
  });
  assert.equal(bad.isError, true);
  const prompts = await client.listPrompts();
  assert.equal(prompts.prompts.length, 1);
  if (process.argv.includes('--live-current')) {
    const result = await client.callTool({ name: 'current_testnet_status', arguments: {} });
    assert.notEqual(result.isError, true);
    assert.equal(result.structuredContent.snapshot.verified, true);
    assert.equal(result.structuredContent.snapshot.verificationBasis, 'observed-official-app');
    await fs.writeFile(
      'docs/evidence/current-mcp-live.json',
      JSON.stringify(
        {
          checkedAt: new Date().toISOString(),
          transport: 'Actual MCP stdio subprocess',
          tool: 'current_testnet_status',
          result: result.structuredContent,
        },
        null,
        2,
      ) + '\n',
    );
    console.log('PASS: real current_testnet_status via MCP stdio against Sepolia.');
  }
  console.log(
    'PASS: real stdio initialize, list/call tools, read resources, list prompts and invalid input.',
  );
} finally {
  await client.close();
  await transport.close();
}
