// Request schemas
export const loginSchema = {
  $id: 'login',
  type: 'object',
  required: ['username', 'password'],
  properties: {
    username: { type: 'string', minLength: 3 },
    password: { type: 'string', minLength: 9 },
  },
};

export const registerSchema = {
  $id: 'register',
  type: 'object',
  required: ['username', 'password'],
  properties: {
    username: { type: 'string', minLength: 3, maxLength: 50 },
    password: { type: 'string', minLength: 9 },
  },
};

// Response schemas
export const userResponseSchema = {
  $id: 'userResponse',
  type: 'object',
  properties: {
    id: { type: 'string' },
    username: { type: 'string' },
  },
};

export const authResponseSchema = {
  $id: 'authResponse',
  type: 'object',
  properties: {
    user: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        username: { type: 'string' },
        role: { type: 'string' },
      },
    },
    token: { type: 'string' },
  },
};

export const errorResponseSchema = {
  $id: 'authErrorResponse',
  type: 'object',
  properties: {
    error: { type: 'string' },
  },
};
