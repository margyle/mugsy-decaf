import { unlinkSync, existsSync } from 'fs';

export async function teardown() {
  const dbPath = process.env.DATABASE_URL || 'testdb';
  try {
    if (existsSync(dbPath)) {
      unlinkSync(dbPath);
      console.log('✔️ Deleted test database file');
    }
  } catch (err) {
    console.warn('⚠️ Could not delete test database file:', err);
  }
}
