import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    testTimeout: 15000,
    coverage: {
      provider: 'v8',
      include: ['packages/sdk/src/*.ts', 'packages/mcp/src/server.ts'],
      reporter: ['text', 'html', 'json-summary'],
    },
  },
  resolve: {
    alias: {
      '@squeekkit/sdk': new URL('./packages/sdk/src/index.ts', import.meta.url).pathname.replace(
        /^\/(\w:)/,
        '$1',
      ),
    },
  },
});
