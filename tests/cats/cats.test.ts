// tests/cats/cats.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { sql } from 'drizzle-orm';
import { cats } from '../../src/db/schema/cats';

let authCookie: string;

describe('Cats API (integration)', () => {
  beforeAll(async () => {
    // seed cats table
    await global.dbClient.run(sql`DELETE FROM cats;`);
    await global.dbClient.insert(cats).values([
      { id: '1', name: 'Franky', type: 'golden nugget' },
      { id: '2', name: 'Boofus', type: 'anxiety void boy' },
    ]);

    // 1) SIGN UP – await it!
    const signUpRes = await global.app.inject({
      method: 'POST',
      url: '/api/v1/auth/sign-up/email',
      payload: {
        email: 'test@test.com',
        password: 'password123',
        name: 'Tester',
      },
    });
    expect(signUpRes.statusCode).toBe(200);

    // 2) SIGN IN – await *that* too!
    const signInRes = await global.app.inject({
      method: 'POST',
      url: '/api/v1/auth/sign-in/email',
      payload: { email: 'test@test.com', password: 'password123' },
    });
    expect(signInRes.statusCode).toBe(200);

    // 3) GRAB COOKIE for future calls
    const header = signInRes.headers['set-cookie'];
    authCookie = Array.isArray(header) ? header[0] : header;
    expect(authCookie).toBeDefined();
  });

  afterAll(async () => {
    // clean up both tables
    await global.sqliteDb.prepare('DELETE FROM "user"').run();
    await global.dbClient.run(sql`DELETE FROM cats;`);
    global.sqliteDb.close();
  });

  it('GET /cats → array of cats', async () => {
    const res = await global.app.inject({ method: 'GET', url: '/api/v1/cats' });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload)).toEqual([
      { id: '1', name: 'Franky', type: 'golden nugget' },
      { id: '2', name: 'Boofus', type: 'anxiety void boy' },
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
      name: 'Franky',
      type: 'golden nugget',
    });
  });

  it('POST /cats creates a cat', async () => {
    // now with a fully awaited authCookie in hand
    const res = await global.app.inject({
      method: 'POST',
      url: '/api/v1/cats',
      payload: { name: 'Luna', type: 'black' },
      headers: { cookie: authCookie },
    });
    expect(res.statusCode).toBe(201);
  });
});
