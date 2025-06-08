export const tagSchema = {
  $id: 'tag',
  type: 'object',
  required: ['name', 'slug'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string', minLength: 1, maxLength: 100 },
    slug: { type: 'string', minLength: 1, maxLength: 100 },
  },
};

export const tagResponseSchema = {
  $id: 'tagResponse',
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    slug: { type: 'string' },
  },
};

export const tagsArrayResponseSchema = {
  $id: 'tagsArrayResponse',
  type: 'array',
  items: { $ref: 'tagResponse#' },
};

export const errorResponseSchema = {
  $id: 'errorResponse',
  type: 'object',
  properties: {
    error: { type: 'string' },
  },
};

// Parameter schemas
export const getTagParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
};

export const createTagBodySchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: { type: 'string', minLength: 3, maxLength: 100 },
  },
};

export const updateTagBodySchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 3, maxLength: 100 },
    slug: { type: 'string', minLength: 3, maxLength: 100 },
  },
};

export const addTagsToRecipeBodySchema = {
  type: 'object',
  required: ['recipe_id', 'tag_names'],
  properties: {
    recipe_id: { type: 'string', minLength: 1 },
    tag_names: {
      type: 'array',
      items: { type: 'string', minLength: 1 },
      minItems: 1,
    },
  },
};
