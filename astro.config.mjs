// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import viteCompression from 'vite-plugin-compression';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  vite: {
    plugins: [
      tailwindcss(),
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 10240,
        deleteOriginFile: false,
      }),
      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 10240,
        deleteOriginFile: false,
      }),
    ],
    server: {
      watch: {
        usePolling: true,
        interval: 100
      }
    }
  }
});
