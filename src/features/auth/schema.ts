// Request schemas
export const loginSchema = {
  $id: 'login',
  type: 'object',
  required: ['username'],
  additionalProperties: false,
  properties: {
    username: { type: 'string', minLength: 3 },
    password: { type: 'string', minLength: 9 },
    pin: {
      type: 'string',
      pattern: '^[0-9]{8}$',
      minLength: 8,
      maxLength: 8,
      description:
        'Exactly 8 digits for PIN authentication. Only available when using Mugsy touchscreen.',
    },
  },
  anyOf: [
    { required: ['username', 'password'] },
    { required: ['username', 'pin'] },
  ],
};

export const registerSchema = {
  $id: 'register',
  type: 'object',
  required: ['username', 'password', 'pin'],
  additionalProperties: false,
  properties: {
    username: { type: 'string', minLength: 3, maxLength: 50 },
    password: { type: 'string', minLength: 9 },
    pin: {
      type: 'string',
      pattern: '^[0-9]{8}$',
      minLength: 8,
      maxLength: 8,
      description:
        'Exactly 8 digits for PIN authentication. Only available when using Mugsy touchscreen.',
    },
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
