import { defineConfig } from 'vitest/config';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    globals: true,
    setupFiles: resolve(__dirname, './test/setup.ts'),
    globalSetup: resolve(__dirname, './test/setup-env.ts'),
    coverage: {
      all: true,
    },
    // ref: https://vitest.dev/config/#testtimeout
    testTimeout: 10000,
  },
});
