# PIN Authentication

This document explains the PIN authentication feature in the DECAF API.

## Overview

DECAF supports dual authentication methods allowing users to choose their preferred method:

- **Password Authentication**: Traditional password-based login
- **PIN Authentication**: 8-digit numeric PIN for quick access

Users can authenticate with either their password OR their PIN on any request.

## PIN Requirements

- **Format**: Exactly 8 digits (0-9)
- **No letters or special characters allowed**
- **Storage**: PINs are bcrypt hashed with same security as passwords
- **Required**: All new user registrations must include a PIN

## API Endpoints

### Registration

**POST** `/api/v1/auth/register`

```json
{
  "username": "johndoe",
  "password": "mySecurePassword123",
  "pin": "12345678"
}
```

**Validation Rules:**

- Username: 3-50 characters
- Password: minimum 9 characters
- PIN: exactly 8 digits (validated via regex `^[0-9]{8}$`)

### Login - Password Authentication

**POST** `/api/v1/auth/login`

```json
{
  "username": "johndoe",
  "password": "mySecurePassword123"
}
```

### Login - PIN Authentication

**POST** `/api/v1/auth/login`

```json
{
  "username": "johndoe",
  "pin": "12345678"
}
```

## Authentication Rules

1. **Either/Or**: Provide either password OR PIN, not both
2. **Required**: At least one authentication method must be provided
3. **Choice**: Users can choose which method to use per login attempt

## Error Responses

### Invalid PIN Format

```json
{
  "error": "Validation Error",
  "message": "The request data is invalid",
  "details": [
    {
      "instancePath": "/pin",
      "keyword": "pattern",
      "message": "must match pattern \"^[0-9]{8}$\""
    }
  ]
}
```

### Missing Authentication

```json
{
  "error": "Either password or PIN is required"
}
```

### Both Provided

```json
{
  "error": "Provide either password or PIN, not both"
}
```

### Invalid Credentials

```json
{
  "error": "Invalid username or credentials"
}
```

## Security Features

1. **Flexible authentication**: Users choose their preferred method per session
2. **Secure hashing**: PINs use bcrypt with same salt rounds as passwords (12)
3. **Input validation**: Schema-level validation prevents invalid PIN formats
4. **Generic error messages**: Consistent error messaging to prevent user enumeration
5. **Mutual exclusion**: Cannot provide both password and PIN simultaneously

## Database Schema

The `users` table includes a `pin` field:

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  pin TEXT NOT NULL,
  role TEXT DEFAULT 'user' NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

## Implementation Details

### PIN Validation

```typescript
function isValidPinFormat(pin: string): boolean {
  return /^[0-9]{8}$/.test(pin);
}
```

### Authentication Logic

The login handler validates:

1. Exactly one authentication method is provided
2. PIN format is valid (if PIN provided)
3. Credentials match stored hashes
4. Returns JWT token on success

## Testing

The PIN authentication feature includes comprehensive test coverage:

- Registration with valid PIN
- Registration with invalid PIN formats
- Login with password
- Login with PIN
- Login with both credentials (rejected)
- Login with neither credential (rejected)
- Invalid credential scenarios

Run tests with:

```bash
npm test tests/auth/auth.test.ts
```

## Usage Examples

### Quick PIN Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "pin": "12345678"}'
```

### Secure Password Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "password": "mySecurePassword123"}'
```

## Future Considerations

- **Localhost Detection**: Restrict PIN authentication to localhost connections only
- **PIN Expiry**: Consider implementing PIN expiration policies
- **Rate Limiting**: Add additional rate limiting for PIN attempts
- **PIN Recovery**: Implement PIN reset functionality
- **Session Tracking**: Track which authentication method was used per session
