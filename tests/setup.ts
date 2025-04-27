// This file contains setup code that will be executed before all tests
// You can add global test setup, mocks, or utility functions here

import { beforeAll, afterAll } from 'vitest';

// Global before/after hooks
beforeAll(async () => {
  // Setup code to run once before all tests
  console.log('Setting up tests...');

  // Example: Initializing test database or mocks
});

afterAll(async () => {
  // Cleanup code to run once after all tests
  console.log('Cleaning up after tests...');

  // Example: Close connections, clear mocks, etc.
});

// Optionally mock global dependencies here
// global.fetch = vi.fn();

// You can also define test utilities that will be available to all tests
export function createTestData() {
  return {
    // Sample test data
    sampleCat: {
      id: '1',
      name: 'Test Cat',
      color: 'orange',
      age: 3,
    },
  };
}
