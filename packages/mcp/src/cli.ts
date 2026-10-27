#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createSqueekKit, publicError } from '@squeekkit/sdk';
import { createServer } from './server';

if (process.argv.includes('--help')) {
  console.error(
    'SqueekKit MCP 0.1.0\nUsage: squeekkit-mcp\nTransport: stdio\nOptional env: SQUEEKKIT_RPC_URL, SQUEEKKIT_API_URL\nRead, simulate and prepare only. No keys or broadcasts.',
  );
} else if (process.argv.includes('--version')) {
  console.error('0.1.0');
} else {
  try {
    const server = createServer(
      createSqueekKit({
        chain: { rpcUrl: process.env.SQUEEKKIT_RPC_URL },
        api: { baseUrl: process.env.SQUEEKKIT_API_URL },
      }),
    );
    await server.connect(new StdioServerTransport());
    for (const signal of ['SIGINT', 'SIGTERM'] as const)
      process.on(signal, () => {
        void server.close().finally(() => process.exit(0));
      });
  } catch (error) {
    console.error(JSON.stringify(publicError(error)));
    process.exitCode = 1;
  }
}
