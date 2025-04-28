import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { recipes, recipe_steps } from '../../db/schema/recipes';
import { eq, sql } from 'drizzle-orm';
import { NotFoundError } from '../../utils/errors';
import { v4 as uuidv4 } from 'uuid';

// Recipe Request Interfaces
interface RecipeParams {
  id: string;
}

interface CreateRecipeBody {
  name: string;
  description?: string;
  coffee_weight: number;
  water_weight: number;
  water_temperature: number;
  grind_size?: string;
  brew_time: number;
}

interface UpdateRecipeBody {
  name?: string;
  description?: string;
  coffee_weight?: number;
  water_weight?: number;
  water_temperature?: number;
  grind_size?: string;
  brew_time?: number;
}

// Recipe Step Request Interfaces
interface RecipeStepParams {
  id: string;
}

interface CreateRecipeStepBody {
  recipe_id: string;
  step_order: number;
  duration_sec?: number;
  command_parameter?: number; // Numeric parameter for the command
  command_type: string; // Required, type of command to execute
}

interface UpdateRecipeStepBody {
  step_order?: number;
  duration_sec?: number;
  command_parameter?: number; // Numeric parameter for the command
  command_type?: string; // Type of command to execute
}

// Recipe Handlers
export async function getAllRecipesHandler(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const allRecipes = await this.db.select().from(recipes);

  // Format response to match schema
  const formattedRecipes = allRecipes.map(recipe => ({
    id: recipe.id,
    created_by: recipe.created_by,
    name: recipe.name,
    description: recipe.description,
    coffee_weight: recipe.coffee_weight,
    water_weight: recipe.water_weight,
    water_temperature: recipe.water_temperature,
    grind_size: recipe.grind_size,
    brew_time: recipe.brew_time,
  }));

  return reply.code(200).send(formattedRecipes);
}

export async function getRecipeByIdHandler(
  this: FastifyInstance,
  request: FastifyRequest<{ Params: RecipeParams }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  // Get recipe
  const result = await this.db.select().from(recipes).where(eq(recipes.id, id));

  if (!result[0]) {
    throw NotFoundError(`Recipe with ID ${id} not found`);
  }

  const recipe = result[0];

  return reply.code(200).send({
    id: recipe.id,
    created_by: recipe.created_by,
    name: recipe.name,
    description: recipe.description,
    coffee_weight: recipe.coffee_weight,
    water_weight: recipe.water_weight,
    water_temperature: recipe.water_temperature,
    grind_size: recipe.grind_size,
    brew_time: recipe.brew_time,
  });
}

export async function createRecipeHandler(
  this: FastifyInstance,
  request: FastifyRequest<{ Body: CreateRecipeBody }>,
  reply: FastifyReply,
) {
  const userId = request.user?.id || null;
  const recipeId = uuidv4();
  const recipeData = {
    id: recipeId,
    created_by: userId,
    ...request.body,
  };

  // Insert recipe
  const result = await this.db.insert(recipes).values(recipeData).returning();
  const recipe = result[0];

  return reply.code(201).send({
    id: recipe.id,
    created_by: recipe.created_by,
    name: recipe.name,
    description: recipe.description,
    coffee_weight: recipe.coffee_weight,
    water_weight: recipe.water_weight,
    water_temperature: recipe.water_temperature,
    grind_size: recipe.grind_size,
    brew_time: recipe.brew_time,
  });
}

export async function updateRecipeHandler(
  this: FastifyInstance,
  request: FastifyRequest<{ Params: RecipeParams; Body: UpdateRecipeBody }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const userId = request.user?.id || null;

  // Check if recipe exists
  const existingRecipe = await this.db
    .select()
    .from(recipes)
    .where(eq(recipes.id, id));

  if (!existingRecipe[0]) {
    throw NotFoundError(`Recipe with ID ${id} not found`);
  }

  // Check if user owns the recipe (if created_by is set)
  if (existingRecipe[0].created_by && existingRecipe[0].created_by !== userId) {
    return reply
      .code(403)
      .send({ error: 'You are not authorized to update this recipe' });
  }

  // Update recipe
  const updateData = {
    ...request.body,
    updatedAt: sql`CURRENT_TIMESTAMP`,
  };

  const result = await this.db
    .update(recipes)
    .set(updateData)
    .where(eq(recipes.id, id))
    .returning();

  const recipe = result[0];

  return reply.code(200).send({
    id: recipe.id,
    created_by: recipe.created_by,
    name: recipe.name,
    description: recipe.description,
    coffee_weight: recipe.coffee_weight,
    water_weight: recipe.water_weight,
    water_temperature: recipe.water_temperature,
    grind_size: recipe.grind_size,
    brew_time: recipe.brew_time,
  });
}

export async function deleteRecipeHandler(
  this: FastifyInstance,
  request: FastifyRequest<{ Params: RecipeParams }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const userId = request.user?.id || null;

  // Check if recipe exists
  const existingRecipe = await this.db
    .select()
    .from(recipes)
    .where(eq(recipes.id, id));

  if (!existingRecipe[0]) {
    throw NotFoundError(`Recipe with ID ${id} not found`);
  }

  // Check if user owns the recipe (if created_by is set)
  if (existingRecipe[0].created_by && existingRecipe[0].created_by !== userId) {
    return reply
      .code(403)
      .send({ error: 'You are not authorized to delete this recipe' });
  }

  // Delete associated recipe steps first
  await this.db.delete(recipe_steps).where(eq(recipe_steps.recipe_id, id));

  // Delete recipe
  await this.db.delete(recipes).where(eq(recipes.id, id));

  return reply.code(204).send();
}

// Recipe Step Handlers
export async function getRecipeStepsHandler(
  this: FastifyInstance,
  request: FastifyRequest<{ Params: RecipeParams }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  // Check if recipe exists
  const existingRecipe = await this.db
    .select()
    .from(recipes)
    .where(eq(recipes.id, id));

  if (!existingRecipe[0]) {
    throw NotFoundError(`Recipe with ID ${id} not found`);
  }

  // Get steps
  const stepsResult = await this.db
    .select()
    .from(recipe_steps)
    .where(eq(recipe_steps.recipe_id, id))
    .orderBy(recipe_steps.step_order);

  // Format steps
  const steps = stepsResult.map(step => ({
    id: step.id,
    recipe_id: step.recipe_id,
    step_order: step.step_order,
    duration_sec: step.duration_sec,
    command_parameter: step.command_parameter,
    command_type: step.command_type,
  }));

  return reply.code(200).send(steps);
}

export async function getRecipeStepByIdHandler(
  this: FastifyInstance,
  request: FastifyRequest<{ Params: RecipeStepParams }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  // Get step
  const result = await this.db
    .select()
    .from(recipe_steps)
    .where(eq(recipe_steps.id, id));

  if (!result[0]) {
    throw NotFoundError(`Recipe step with ID ${id} not found`);
  }

  const step = result[0];

  return reply.code(200).send({
    id: step.id,
    recipe_id: step.recipe_id,
    step_order: step.step_order,
    duration_sec: step.duration_sec,
    command_parameter: step.command_parameter,
    command_type: step.command_type,
  });
}

export async function createRecipeStepHandler(
  this: FastifyInstance,
  request: FastifyRequest<{ Body: CreateRecipeStepBody }>,
  reply: FastifyReply,
) {
  const { recipe_id } = request.body;
  const userId = request.user?.id || null;

  // Check if recipe exists
  const existingRecipe = await this.db
    .select()
    .from(recipes)
    .where(eq(recipes.id, recipe_id));

  if (!existingRecipe[0]) {
    throw NotFoundError(`Recipe with ID ${recipe_id} not found`);
  }

  // Check if user owns the recipe (if created_by is set)
  if (existingRecipe[0].created_by && existingRecipe[0].created_by !== userId) {
    return reply
      .code(403)
      .send({ error: 'You are not authorized to add steps to this recipe' });
  }

  // Generate UUID for the step
  const stepId = uuidv4();

  // Prepare step data
  const stepData = {
    id: stepId,
    ...request.body,
  };

  // Insert step
  const result = await this.db
    .insert(recipe_steps)
    .values(stepData)
    .returning();
  const step = result[0];

  return reply.code(201).send({
    id: step.id,
    recipe_id: step.recipe_id,
    step_order: step.step_order,
    duration_sec: step.duration_sec,
    command_parameter: step.command_parameter,
    command_type: step.command_type,
  });
}

export async function updateRecipeStepHandler(
  this: FastifyInstance,
  request: FastifyRequest<{
    Params: RecipeStepParams;
    Body: UpdateRecipeStepBody;
  }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const userId = request.user?.id || null;

  // Get step and associated recipe
  const stepResult = await this.db
    .select()
    .from(recipe_steps)
    .where(eq(recipe_steps.id, id));

  if (!stepResult[0]) {
    throw NotFoundError(`Recipe step with ID ${id} not found`);
  }

  const step = stepResult[0];

  // Check if recipe exists and user has permission
  const recipeResult = await this.db
    .select()
    .from(recipes)
    .where(eq(recipes.id, step.recipe_id));

  if (!recipeResult[0]) {
    throw NotFoundError(`Recipe with ID ${step.recipe_id} not found`);
  }

  if (recipeResult[0].created_by && recipeResult[0].created_by !== userId) {
    return reply.code(403).send({
      error: 'You are not authorized to update steps for this recipe',
    });
  }

  // Update step
  const updateData = {
    ...request.body,
    updatedAt: sql`CURRENT_TIMESTAMP`,
  };

  const result = await this.db
    .update(recipe_steps)
    .set(updateData)
    .where(eq(recipe_steps.id, id))
    .returning();

  const updatedStep = result[0];

  return reply.code(200).send({
    id: updatedStep.id,
    recipe_id: updatedStep.recipe_id,
    step_order: updatedStep.step_order,
    duration_sec: updatedStep.duration_sec,
    command_parameter: updatedStep.command_parameter,
    command_type: updatedStep.command_type,
  });
}

export async function deleteRecipeStepHandler(
  this: FastifyInstance,
  request: FastifyRequest<{ Params: RecipeStepParams }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const userId = request.user?.id || null;

  // Get step and associated recipe
  const stepResult = await this.db
    .select()
    .from(recipe_steps)
    .where(eq(recipe_steps.id, id));

  if (!stepResult[0]) {
    throw NotFoundError(`Recipe step with ID ${id} not found`);
  }

  const step = stepResult[0];

  // Check if recipe exists and user has permission
  const recipeResult = await this.db
    .select()
    .from(recipes)
    .where(eq(recipes.id, step.recipe_id));

  if (!recipeResult[0]) {
    throw NotFoundError(`Recipe with ID ${step.recipe_id} not found`);
  }

  if (recipeResult[0].created_by && recipeResult[0].created_by !== userId) {
    return reply.code(403).send({
      error: 'You are not authorized to delete steps for this recipe',
    });
  }

  // Delete step
  await this.db.delete(recipe_steps).where(eq(recipe_steps.id, id));

  return reply.code(204).send();
}
