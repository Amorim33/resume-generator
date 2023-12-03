import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'apps/*/vitest.config.ts',
  'apps/*/vite.config.ts',
  'packages/*/vitest.config.ts',
]);
