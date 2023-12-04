import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    globalSetup: 'test/setup-env.ts',
    coverage: {
      all: true,
    },
    // ref: https://vitest.dev/config/#testtimeout
    testTimeout: 10000,
  },
});
