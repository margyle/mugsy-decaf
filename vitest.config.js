const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: './tests/setup.ts',
    globalSetup: './tests/teardown.ts',
    include: ['./tests/**/*.test.ts'],
    logLevel: 'error',
    reporter: ['verbose'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: ['node_modules/', 'tests/setup.ts'],
    },
  },
});
