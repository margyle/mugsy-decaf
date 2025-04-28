import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as bcrypt from 'bcrypt';
import { sql } from 'drizzle-orm';
import { users } from '../../src/db/schema/users';

// constants matching handlers
const SALT_ROUNDS = 12;

beforeAll(async () => {
  // truncate users table
  await global.dbClient.run(sql`DELETE FROM users`);
  // seed a known user for login tests
  const hashed = await bcrypt.hash('password123', SALT_ROUNDS);
  await global.dbClient
    .insert(users)
    .values([
      { id: '1', username: 'testuser', password: hashed, role: 'user' },
    ]);
});

afterAll(async () => {
  // clean up
  await global.dbClient.run(sql`DELETE FROM users`);
});

describe('Auth API (integration)', () => {
  it('POST /auth/register → 201 & user payload', async () => {
    const res = await global.app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { username: 'newuser', password: 'newpass456' },
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('id');
    expect(body.username).toBe('newuser');
  });

  it('POST /auth/register duplicate → 409', async () => {
    // attempt to register same username from seed
    const res = await global.app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { username: 'testuser', password: 'password123' },
    });
    console.log(`foo: ${res}`);
    expect(res.statusCode).toBe(409);
    expect(JSON.parse(res.payload)).toEqual({
      error: 'Username already exists',
    });
  });

  it('POST /auth/login valid → 200 & token', async () => {
    const res = await global.app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { username: 'testuser', password: 'password123' },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('token');
    expect(body.user).toMatchObject({
      id: '1',
      username: 'testuser',
      role: 'user',
    });
  });

  it('POST /auth/login wrong password → 401', async () => {
    const res = await global.app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { username: 'testuser', password: 'wrongwrongworong' },
    });
    expect(res.statusCode).toBe(401);
    expect(JSON.parse(res.payload)).toEqual({
      error: 'Invalid username or password',
    });
  });

  it('POST /auth/login unknown user → 401', async () => {
    const res = await global.app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { username: 'nouser', password: '123456789' },
    });
    expect(res.statusCode).toBe(401);
    expect(JSON.parse(res.payload)).toEqual({
      error: 'Invalid username or password',
    });
  });
});
