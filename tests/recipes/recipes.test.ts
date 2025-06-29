import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { sql } from 'drizzle-orm';
import { recipes } from '../../src/db/schema/recipes';

let authCookie: string;

const testEmail = `recipesUser${Date.now()}@test.com`;

const authHeader = () => {
  const token = global.app.jwt.sign({
    id: 'test',
    username: 'test',
    role: 'admin',
  });
  return { authorization: `Bearer ${token}` };
};

beforeAll(async () => {
  // reset recipes table
  await global.dbClient.run(sql`DELETE FROM recipe_steps`);
  await global.dbClient.run(sql`DELETE FROM recipes`);
  await global.dbClient.run(sql`DELETE FROM "user"`);

  // seed two recipes
  await global.dbClient.insert(recipes).values([
    {
      id: 'r1',
      created_by: 'uuid-blah',
      name: 'Espresso',
      description: 'Strong coffee',
      coffee_weight: 18,
      water_weight: 36,
      water_temperature: 92,
      grind_size: 'fine',
      brew_time: 30,
    },
    {
      id: 'r2',
      created_by: 'uuid-foo',
      name: 'Long Coffee',
      description: 'Diluted shot',
      coffee_weight: 18,
      water_weight: 60,
      water_temperature: 90,
      grind_size: 'medium',
      brew_time: 45,
    },
  ]);

  const signUpRes = await global.app.inject({
    method: 'POST',
    url: '/api/v1/auth/sign-up/email',
    payload: {
      email: testEmail,
      password: 'password123',
      name: 'Test User',
    },
  });
  if (signUpRes.statusCode !== 200) {
    throw new Error(`Sign-up failed: ${signUpRes.statusCode}`);
  }

  const signInRes = await global.app.inject({
    method: 'POST',
    url: '/api/v1/auth/sign-in/email',
    payload: { email: testEmail, password: 'password123' },
  });
  if (signInRes.statusCode !== 200) {
    throw new Error(`Sign-in failed: ${signInRes.statusCode}`);
  }
  const header = signInRes.headers['set-cookie'];
  authCookie = Array.isArray(header) ? header[0] : header;
});

afterAll(async () => {
  await global.sqliteDb.prepare('DELETE FROM "recipes"').run();
});

describe('Recipes API (integration)', () => {
  it('GET /recipes → array of recipes', async () => {
    const res = await global.app.inject({
      method: 'GET',
      url: '/api/v1/recipes',
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload)).toEqual([
      {
        id: 'r1',
        name: 'Espresso',
        description: 'Strong coffee',
        coffee_weight: 18,
        water_weight: 36,
        water_temperature: 92,
        grind_size: 'fine',
        brew_time: 30,
        created_by: 'uuid-blah',
      },
      {
        id: 'r2',
        name: 'Long Coffee',
        description: 'Diluted shot',
        coffee_weight: 18,
        water_weight: 60,
        water_temperature: 90,
        grind_size: 'medium',
        brew_time: 45,
        created_by: 'uuid-foo',
      },
    ]);
  });

  it('GET /recipes/:id → single recipe', async () => {
    const res = await global.app.inject({
      method: 'GET',
      url: '/api/v1/recipes/r1',
    });
    expect(res.statusCode).toBe(200);
    console.log(res.payload);
    expect(JSON.parse(res.payload)).toEqual({
      id: 'r1',
      name: 'Espresso',
      description: 'Strong coffee',
      coffee_weight: 18,
      water_weight: 36,
      water_temperature: 92,
      grind_size: 'fine',
      brew_time: 30,
      created_by: 'uuid-blah',
    });
  });

  it('POST /recipes creates a recipe', async () => {
    const payload = {
      name: 'Test Brew',
      description: 'Test',
      coffee_weight: 20,
      water_weight: 40,
      water_temperature: 95,
      grind_size: 'medium-coarse',
      brew_time: 60,
    };
    const res = await global.app.inject({
      method: 'POST',
      url: '/api/v1/recipes',
      payload,
      headers: { cookie: authCookie },
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload);
    expect(body).toMatchObject(payload);
    expect(typeof body.id).toBe('string');
    expect(body.name).toBe('Test Brew');
  });
});
