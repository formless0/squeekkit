import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
const transport = new StdioClientTransport({
  command: process.execPath,
  args: ['packages/mcp/dist/cli.js'],
  stderr: 'pipe',
});
const client = new Client({ name: 'squeekkit-smoke', version: '0.1.0' });
try {
  await client.connect(transport);
  const tools = await client.listTools();
  assert.equal(tools.tools.length, 10);
  const resources = await client.listResources();
  assert.equal(resources.resources.length, 2);
  const deployment = await client.readResource({ uri: 'squeekkit://deployment/sepolia' });
  assert.equal(JSON.parse(deployment.contents[0].text).chainId, 11155111);
  const bad = await client.callTool({
    name: 'inspect_squeeks',
    arguments: { owner: 'not-an-address', tokenIds: ['1'] },
  });
  assert.equal(bad.isError, true);
  const prompts = await client.listPrompts();
  assert.equal(prompts.prompts.length, 1);
  console.log(
    'PASS: real stdio initialize, list/call tools, read resources, list prompts and invalid input.',
  );
} finally {
  await client.close();
  await transport.close();
}
