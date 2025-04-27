// Define allowed command types
const ALLOWED_COMMAND_TYPES = [
  'move',
  'grind',
  'pour',
  'wait',
  'measure',
  'other',
];

// Recipe entity schema
export const recipeSchema = {
  $id: 'recipe',
  type: 'object',
  required: [
    'name',
    'coffee_weight',
    'water_weight',
    'water_temperature',
    'brew_time',
  ],
  properties: {
    id: { type: 'string' },
    created_by: { type: 'string' },
    name: { type: 'string', minLength: 1, maxLength: 100 },
    description: { type: 'string' },
    coffee_weight: { type: 'number', minimum: 0 },
    water_weight: { type: 'number', minimum: 0 },
    water_temperature: { type: 'integer', minimum: 0, maximum: 100 },
    grind_size: { type: 'string' },
    brew_time: { type: 'integer', minimum: 0 },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

export const recipeStepSchema = {
  $id: 'recipeStep',
  type: 'object',
  required: ['id', 'recipe_id', 'step_order', 'command_type'],
  properties: {
    id: { type: 'string' },
    recipe_id: { type: 'string' },
    step_order: { type: 'integer', minimum: 0 },
    duration_sec: { type: 'integer', minimum: 0 },
    command_parameter: {
      type: 'integer',
      description: 'Numeric parameter for the command',
    },
    command_type: {
      type: 'string',
      enum: ALLOWED_COMMAND_TYPES,
      description: 'Type of command to execute',
    },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

// Response schemas
export const recipeResponseSchema = {
  $id: 'recipeResponse',
  type: 'object',
  properties: {
    id: { type: 'string' },
    created_by: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    coffee_weight: { type: 'number' },
    water_weight: { type: 'number' },
    water_temperature: { type: 'integer' },
    grind_size: { type: 'string' },
    brew_time: { type: 'integer' },
  },
};

export const recipeWithStepsResponseSchema = {
  $id: 'recipeWithStepsResponse',
  type: 'object',
  properties: {
    ...recipeResponseSchema.properties,
    steps: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          step_order: { type: 'integer' },
          duration_sec: { type: 'integer' },
          command_parameter: { type: 'integer' },
          command_type: { type: 'string' },
        },
      },
    },
  },
};

export const recipeStepResponseSchema = {
  $id: 'recipeStepResponse',
  type: 'object',
  properties: {
    id: { type: 'string' },
    recipe_id: { type: 'string' },
    step_order: { type: 'integer' },
    duration_sec: { type: 'integer' },
    command_parameter: { type: 'integer' },
    command_type: { type: 'string' },
  },
};

export const recipesArrayResponseSchema = {
  $id: 'recipesArrayResponse',
  type: 'array',
  items: { $ref: 'recipeResponse#' },
};

export const recipeStepsArrayResponseSchema = {
  $id: 'recipeStepsArrayResponse',
  type: 'array',
  items: { $ref: 'recipeStepResponse#' },
};

export const errorResponseSchema = {
  $id: 'recipeErrorResponse',
  type: 'object',
  properties: {
    error: { type: 'string' },
  },
};

// Request schemas
export const getRecipeParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
};

export const createRecipeBodySchema = {
  type: 'object',
  required: [
    'name',
    'coffee_weight',
    'water_weight',
    'water_temperature',
    'brew_time',
  ],
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 100 },
    description: { type: 'string' },
    coffee_weight: { type: 'number', minimum: 0 },
    water_weight: { type: 'number', minimum: 0 },
    water_temperature: { type: 'integer', minimum: 0, maximum: 100 },
    grind_size: { type: 'string' },
    brew_time: { type: 'integer', minimum: 0 },
  },
};

export const updateRecipeBodySchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 100 },
    description: { type: 'string' },
    coffee_weight: { type: 'number', minimum: 0 },
    water_weight: { type: 'number', minimum: 0 },
    water_temperature: { type: 'integer', minimum: 0, maximum: 100 },
    grind_size: { type: 'string' },
    brew_time: { type: 'integer', minimum: 0 },
  },
};

export const getRecipeStepParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
};

export const createRecipeStepBodySchema = {
  type: 'object',
  required: ['recipe_id', 'step_order', 'command_type'],
  properties: {
    recipe_id: { type: 'string' },
    step_order: { type: 'integer', minimum: 0 },
    duration_sec: { type: 'integer', minimum: 0 },
    command_parameter: {
      type: 'integer',
      description: 'Numeric parameter for the command',
    },
    command_type: {
      type: 'string',
      enum: ALLOWED_COMMAND_TYPES,
      description: 'Type of command to execute',
    },
  },
};

export const updateRecipeStepBodySchema = {
  type: 'object',
  properties: {
    step_order: { type: 'integer', minimum: 0 },
    duration_sec: { type: 'integer', minimum: 0 },
    command_parameter: {
      type: 'integer',
      description: 'Numeric parameter for the command',
    },
    command_type: {
      type: 'string',
      enum: ALLOWED_COMMAND_TYPES,
      description: 'Type of command to execute',
    },
  },
};
