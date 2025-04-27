import { describe, it, expect, beforeEach } from 'vitest';
import { createTestData } from '../setup';

describe('Cats Feature', () => {
  // Setup for all cat tests
  let testData: ReturnType<typeof createTestData>;

  beforeEach(() => {
    // Reset test data before each test
    testData = createTestData();
  });

  describe('Basic functionality', () => {
    it('should pass a simple test', () => {
      expect(true).toBe(true);
    });

    it('should have valid test data', () => {
      const { sampleCat } = testData;
      expect(sampleCat).toBeDefined();
      expect(sampleCat.name).toBe('Test Cat');
    });
  });

  describe('Cat object validation', () => {
    it('should have required properties', () => {
      const { sampleCat } = testData;
      expect(sampleCat).toHaveProperty('id');
      expect(sampleCat).toHaveProperty('name');
      expect(sampleCat).toHaveProperty('color');
      expect(sampleCat).toHaveProperty('age');
    });

    it('should have correct types', () => {
      const { sampleCat } = testData;
      expect(typeof sampleCat.id).toBe('string');
      expect(typeof sampleCat.name).toBe('string');
      expect(typeof sampleCat.color).toBe('string');
      expect(typeof sampleCat.age).toBe('number');
    });
  });
});
