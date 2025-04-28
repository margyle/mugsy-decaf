import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { sql } from 'drizzle-orm';
import { recipes, recipe_steps } from '../../src/db/schema/recipes';

const authHeader = () => {
  const token = global.app.jwt.sign({
    id: 'test',
    username: 'test',
    role: 'admin',
  });
  return { authorization: `Bearer ${token}` };
};

beforeAll(async () => {
  // clean tables
  await global.dbClient.run(sql`DELETE FROM recipe_steps`);
  await global.dbClient.run(sql`DELETE FROM recipes`);

  // seed a recipe and steps
  await global.dbClient.insert(recipes).values([
    {
      id: 'r1',
      created_by: null,
      name: 'Test Recipe',
      description: 'Desc',
      coffee_weight: 10,
      water_weight: 20,
      water_temperature: 90,
      grind_size: 'medium',
      brew_time: 60,
    },
  ]);
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
});

describe('Recipe Steps API (integration)', () => {
  it('GET /recipes/:id/steps → array of steps', async () => {
    const res = await global.app.inject({
      method: 'GET',
      url: '/api/v1/recipes/r1/steps',
    });
    expect(res.statusCode).toBe(200);
    console.log(res.payload);
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
      headers: authHeader(),
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload);
    expect(body).toMatchObject({
      step_order: 3,
      duration_sec: 60,
      command_parameter: 0,
      command_type: 'pour',
    });
    expect(typeof body.id).toBe('string');
  });
});
