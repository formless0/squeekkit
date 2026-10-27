import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { currentApiProxy } from './api-proxy';
export default defineConfig({
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1' },
  base: './',
  plugins: [
    react(),
    {
      name: 'current-testnet-read-proxy',
      configureServer(server) {
        server.middlewares.use(currentApiProxy());
      },
      configurePreviewServer(server) {
        server.middlewares.use(currentApiProxy());
      },
    },
  ],
});
