# Authentication in DECAF

This document explains how authentication works in the DECAF API across different environments.

## Authentication Flow

DECAF uses JWT (JSON Web Tokens) for authentication. The process works as follows:

1. **User Registration**: New users register via `/api/v1/auth/register`
2. **User Login**: Users authenticate via `/api/v1/auth/login` and receive a JWT token
3. **Token Usage**: Subsequent requests include the token in the `Authorization` header
4. **Token Verification**: Protected routes verify the token before processing

## Environment-Specific Configuration

### Development Environment

In development, authentication is fully enabled but with relaxed security:

- Tokens have a long expiration time (1 day by default)
- JWT secret is a simple development value
- CORS is open to all origins
- Detailed error messages are returned

**Testing Authentication in Development:**

```bash
# Register a new user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'

# Login and get token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'

# Use token to access protected endpoint
curl -X POST http://localhost:3000/api/v1/cats \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Fluffy", "type": "persian"}'
```

### Production Environment

In production, security is tightened:

- JWT secret is a strong, unique value
- Shorter token expiration times
- CORS is restricted to specific domains
- Error messages are generic to avoid information leakage
- HTTPS is enforced

## Role-Based Access Control

The system supports role-based access via the `authorizeRoles` decorator:

- **Regular users** can access their own resources
- **Admin users** can access all resources

Example of role-based protection:

```typescript
// Allow only admins to access this route
fastify.route({
  method: "GET",
  url: "/admin/stats",
  preHandler: [fastify.authorizeRoles(["admin"])],
  handler: adminStatsHandler,
});
```

## Customizing Authentication

You can customize authentication behavior by modifying:

1. **JWT Settings**: Edit `src/config/env.ts` to change token lifetime and secrets
2. **CORS Settings**: Edit `src/plugins/cors.ts` to adjust allowed origins
3. **Auth Plugin**: Edit `src/plugins/auth.ts` for custom authentication logic

## Testing with Authentication

For local development testing, use the following approach:

1. Use the login endpoint to get a valid token
2. Store the token in a variable or tool like Postman
3. Include the token in subsequent requests

You can also use the Swagger UI at `/documentation` which has built-in authentication support.

## Security Best Practices

- Never commit JWT secrets to version control
- Use environment variables for all sensitive values
- Rotate JWT secrets periodically
- Keep token expiration times short in production
