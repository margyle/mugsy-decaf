import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: './test/setup.ts', // optional
    coverage: {
      provider: 'c8',
      reporter: ['text', 'lcov'],
    },
  },
});
