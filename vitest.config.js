const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: './test/setup.ts', // optional
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
});
