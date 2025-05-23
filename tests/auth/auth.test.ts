import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as bcrypt from 'bcrypt';
import { sql } from 'drizzle-orm';
import { users } from '../../src/db/schema/users';

// constants matching handlers
const SALT_ROUNDS = 12;

beforeAll(async () => {
  // truncate users table
  await global.dbClient.run(sql`DELETE FROM users`);
  // seed a known user for login tests with both password and PIN
  const hashedPassword = await bcrypt.hash('password123', SALT_ROUNDS);
  const hashedPin = await bcrypt.hash('12345678', SALT_ROUNDS);
  await global.dbClient.insert(users).values([
    {
      id: '1',
      username: 'testuser',
      password: hashedPassword,
      pin: hashedPin,
      role: 'user',
    },
  ]);
});

afterAll(async () => {
  await global.dbClient.run(sql`DELETE FROM users`);
});

describe('Auth API (integration)', () => {
  describe('Registration', () => {
    it('POST /auth/register → 201 & user payload with PIN', async () => {
      const res = await global.app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          username: 'newuser',
          password: 'newpass456',
          pin: '87654321',
        },
      });
      expect(res.statusCode).toBe(201);
      const body = JSON.parse(res.payload);
      expect(body).toHaveProperty('id');
      expect(body.username).toBe('newuser');
    });

    it('POST /auth/register with invalid PIN format → 400', async () => {
      const res = await global.app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          username: 'badpin',
          password: 'password123',
          pin: '123', // too short
        },
      });
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.payload);
      expect(body.error).toBe('Validation Error');
      expect(body.message).toBe('The request data is invalid');
    });

    it('POST /auth/register with non-numeric PIN → 400', async () => {
      const res = await global.app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          username: 'badpin2',
          password: 'password123',
          pin: '1234abcd', // contains letters
        },
      });
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.payload);
      expect(body.error).toBe('Validation Error');
      expect(body.message).toBe('The request data is invalid');
    });

    it('POST /auth/register with numeric PIN → 201', async () => {
      const res = await global.app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          username: 'numpin',
          password: 'password123',
          pin: 12345678, // number gets converted to string
        },
      });
      expect(res.statusCode).toBe(201);
      const body = JSON.parse(res.payload);
      expect(body).toHaveProperty('id');
      expect(body.username).toBe('numpin');
    });

    it('POST /auth/register with leading zero PIN → 201', async () => {
      const res = await global.app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          username: 'leadingzero',
          password: 'password123',
          pin: '01234567', // leading zero preserved
        },
      });
      expect(res.statusCode).toBe(201);
      const body = JSON.parse(res.payload);
      expect(body).toHaveProperty('id');
      expect(body.username).toBe('leadingzero');
    });

    it('POST /auth/register duplicate username → 409', async () => {
      const res = await global.app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          username: 'testuser',
          password: 'password123',
          pin: '12345678',
        },
      });
      expect(res.statusCode).toBe(409);
      expect(JSON.parse(res.payload)).toEqual({
        error: 'Username already exists',
      });
    });
  });

  describe('Login Authentication', () => {
    it('POST /auth/login with password → 200 & token', async () => {
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

    it('POST /auth/login with PIN → 200 & token', async () => {
      const res = await global.app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: { username: 'testuser', pin: '12345678' },
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

    it('POST /auth/login with numeric PIN → 200', async () => {
      const res = await global.app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: { username: 'testuser', pin: 12345678 }, // number gets converted
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.user.username).toBe('testuser');
      expect(body).toHaveProperty('token');
    });

    it('POST /auth/login with wrong password → 401', async () => {
      const res = await global.app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: { username: 'testuser', password: 'wrongpassword' },
      });
      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res.payload)).toEqual({
        error: 'Invalid username or credentials',
      });
    });

    it('POST /auth/login with wrong PIN → 401', async () => {
      const res = await global.app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: { username: 'testuser', pin: '87654321' },
      });
      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res.payload)).toEqual({
        error: 'Invalid username or credentials',
      });
    });

    it('POST /auth/login with both password and PIN → 400', async () => {
      const res = await global.app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          username: 'testuser',
          password: 'password123',
          pin: '12345678',
        },
      });
      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.payload)).toEqual({
        error: 'Provide either password or PIN, not both',
      });
    });

    it('POST /auth/login with neither password nor PIN → 400', async () => {
      const res = await global.app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: { username: 'testuser' },
      });
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.payload);
      expect(body.error).toBe('Validation Error');
      expect(body.message).toBe('The request data is invalid');
    });

    it('POST /auth/login with invalid PIN format → 400', async () => {
      const res = await global.app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: { username: 'testuser', pin: '123' },
      });
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.payload);
      expect(body.error).toBe('Validation Error');
      expect(body.message).toBe('The request data is invalid');
    });

    it('POST /auth/login unknown user → 401', async () => {
      const res = await global.app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: { username: 'nouser', password: '123456789' },
      });
      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res.payload)).toEqual({
        error: 'Invalid username or credentials',
      });
    });

    it('POST /auth/login with leading zero PIN → 200', async () => {
      // First register user with leading zero PIN
      await global.app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          username: 'leadingzerouser',
          password: 'password123',
          pin: '00123456',
        },
      });

      // Then login with same PIN
      const res = await global.app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          username: 'leadingzerouser',
          pin: '00123456',
        },
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.user.username).toBe('leadingzerouser');
      expect(body).toHaveProperty('token');
    });
  });
});
