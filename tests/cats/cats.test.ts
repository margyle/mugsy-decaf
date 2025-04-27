import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { sql } from 'drizzle-orm';
import { cats } from '../../src/db/schema/cats';

beforeAll(async () => {
  await global.dbClient.run(sql`DELETE FROM cats`);
  await global.dbClient.insert(cats).values([
    { id: '1', name: 'Mittens', type: 'tabby' },
    { id: '2', name: 'Garfield', type: 'orange' },
  ]);
});

afterAll(async () => {
  // Clean cats table after this tests run
  await global.dbClient.run(sql`DELETE FROM cats`);
});

describe('Cats API (integration)', () => {
  it('GET /cats → array of cats', async () => {
    const res = await global.app.inject({ method: 'GET', url: '/api/v1/cats' });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload)).toEqual([
      { id: '1', name: 'Mittens', type: 'tabby' },
      { id: '2', name: 'Garfield', type: 'orange' },
    ]);
  });

  it('GET /cats/1 → single cat', async () => {
    const res = await global.app.inject({
      method: 'GET',
      url: '/api/v1/cats/1',
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload)).toEqual({
      id: '1',
      name: 'Mittens',
      type: 'tabby',
    });
  });

  it('POST /cats creates a cat', async () => {
    // sign a valid token for authentication
    const token = global.app.jwt.sign({
      id: 'test',
      username: 'test',
      role: 'admin',
    });
    const res = await global.app.inject({
      method: 'POST',
      url: '/api/v1/cats',
      payload: { name: 'Luna', type: 'black' },
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload);
    expect(body).toMatchObject({ name: 'Luna', type: 'black' });
    expect(typeof body.id).toBe('string');
  });
});
