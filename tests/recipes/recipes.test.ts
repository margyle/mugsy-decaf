import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { sql } from 'drizzle-orm';
import { recipes, recipe_steps } from '../../src/db/schema/recipes';

let authCookie: string;
const testEmail = `recipesUser${Date.now()}@test.com`;

beforeAll(async () => {
  // Clean tables
  await global.dbClient.run(sql`DELETE FROM recipe_steps`);
  await global.dbClient.run(sql`DELETE FROM recipes`);
  await global.dbClient.run(sql`DELETE FROM "user"`);

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
    console.error('Sign-up failed:', signUpRes.payload);
    throw new Error(`Sign-up failed: ${signUpRes.statusCode}`);
  }

  const signInRes = await global.app.inject({
    method: 'POST',
    url: '/api/v1/auth/sign-in/email',
    payload: { email: testEmail, password: 'password123' },
  });
  if (signInRes.statusCode !== 200) {
    console.error('Sign-in failed:', signInRes.payload);
    throw new Error(`Sign-in failed: ${signInRes.statusCode}`);
  }
  const header = signInRes.headers['set-cookie'];
  authCookie = Array.isArray(header) ? header[0] : header;

  // Get the user ID from the response
  const userPayload = JSON.parse(signInRes.payload);
  const userId = userPayload.user?.id || userPayload.id; // Adjust based on your response structure
  console.log('Created user with ID:', userId);

  // Seed recipes with the actual user ID
  await global.dbClient.insert(recipes).values([
    {
      id: 'r1',
      created_by: userId,
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
      created_by: userId,
      name: 'Long Coffee',
      description: 'Diluted shot',
      coffee_weight: 18,
      water_weight: 60,
      water_temperature: 90,
      grind_size: 'medium',
      brew_time: 45,
    },
  ]);

  // Seed recipe steps
  await global.dbClient.insert(recipe_steps).values([
    {
      id: 's1',
      recipe_id: 'r1',
      step_order: 1,
      duration_sec: 30,
      command_parameter: 0,
      command_type: 'move',
    },
    {
      id: 's2',
      recipe_id: 'r1',
      step_order: 2,
      duration_sec: 45,
      command_parameter: 0,
      command_type: 'wait',
    },
  ]);
});

afterAll(async () => {
  await global.dbClient.run(sql`DELETE FROM recipe_steps`);
  await global.dbClient.run(sql`DELETE FROM recipes`);
  await global.dbClient.run(sql`DELETE FROM "user"`);
});

describe('Recipes API (integration)', () => {
  describe('Recipes', () => {
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
          created_by: expect.any(String),
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
          created_by: expect.any(String),
        },
      ]);
    });

    it('GET /recipes/:id → single recipe', async () => {
      const res = await global.app.inject({
        method: 'GET',
        url: '/api/v1/recipes/r1',
      });
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload)).toEqual({
        id: 'r1',
        name: 'Espresso',
        description: 'Strong coffee',
        coffee_weight: 18,
        water_weight: 36,
        water_temperature: 92,
        grind_size: 'fine',
        brew_time: 30,
        created_by: expect.any(String),
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

  describe('Recipe Steps', () => {
    it('GET /recipes/:id/steps → array of steps', async () => {
      const res = await global.app.inject({
        method: 'GET',
        url: '/api/v1/recipes/r1/steps',
      });
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload)).toEqual([
        {
          id: 's1',
          step_order: 1,
          recipe_id: 'r1',
          duration_sec: 30,
          command_parameter: 0,
          command_type: 'move',
        },
        {
          id: 's2',
          step_order: 2,
          recipe_id: 'r1',
          duration_sec: 45,
          command_parameter: 0,
          command_type: 'wait',
        },
      ]);
    });

    it('GET /recipes/steps/:id → single step', async () => {
      const res = await global.app.inject({
        method: 'GET',
        url: '/api/v1/recipes/steps/s1',
      });
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload)).toEqual({
        id: 's1',
        recipe_id: 'r1',
        step_order: 1,
        duration_sec: 30,
        command_parameter: 0,
        command_type: 'move',
      });
    });

    it('POST /recipes/steps creates a step', async () => {
      const payload = {
        recipe_id: 'r1',
        step_order: 3,
        duration_sec: 60,
        command_parameter: 0,
        command_type: 'pour',
      };
      const res = await global.app.inject({
        method: 'POST',
        url: '/api/v1/recipes/steps',
        payload,
        headers: { cookie: authCookie },
      });

      // Add debugging if test fails
      if (res.statusCode !== 201) {
        console.error('POST steps failed:');
        console.error('Status:', res.statusCode);
        console.error('Response:', res.payload);
        console.error('Auth cookie:', authCookie);
      }

      expect(res.statusCode).toBe(201);
      const body = JSON.parse(res.payload);
      expect(body).toMatchObject(payload);
      expect(typeof body.id).toBe('string');
    });
  });
});
