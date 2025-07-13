# User Preferences API Documentation

## Overview

The User Preferences API allows users to manage their personal coffee brewing preferences and application settings. All endpoints require authentication via Better Auth session cookies.

**Base URL**: `/api/v1/user-preferences`

## Authentication

All user preferences endpoints require authentication. Users can only access and modify their own preferences.

**Authentication Method**: Better Auth session cookies (automatically handled by the browser)

## Endpoints

### 1. Get Current User's Preferences

Retrieve the authenticated user's preferences.

```http
GET /api/v1/user-preferences
```

**Headers:**

```
Cookie: better-auth.session_token=<session-token>
```

**Response (200 OK):**

```json
{
  "id": "uuid",
  "userId": "user-uuid",
  "strengthPreference": "medium",
  "defaultCupSize": 350,
  "notificationsBrewed": true,
  "notificationsMaintenance": true,
  "notificationsErrors": true,
  "notificationMethod": "email",
  "smsPhoneNumber": "+15551234567",
  "allowIntegrations": false,
  "cloudControlAccess": true,
  "theme": "dark",
  "autoBrewSchedule": "{\"enabled\": true, \"time\": \"07:00\", \"days\": [\"monday\", \"tuesday\", \"wednesday\", \"thursday\", \"friday\"]}",
  "units": "metric",
  "shareRecipes": true,
  "language": "en",
  "timezone": "America/New_York",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T15:45:00.000Z"
}
```

**Error Responses:**

- `401 Unauthorized`: User not authenticated
- `404 Not Found`: User preferences not found

---

### 2. Create User Preferences

Create preferences for the authenticated user. User can only have one set of preferences.

```http
POST /api/v1/user-preferences
```

**Headers:**

```
Content-Type: application/json
Cookie: better-auth.session_token=<session-token>
```

**Request Body:**
All fields are optional. Missing fields will use default values.

```json
{
  "strengthPreference": "medium",
  "defaultCupSize": 350,
  "notificationsBrewed": false,
  "notificationsMaintenance": true,
  "notificationsErrors": true,
  "notificationMethod": "sms",
  "smsPhoneNumber": "+15551234567",
  "allowIntegrations": true,
  "cloudControlAccess": true,
  "theme": "dark",
  "autoBrewSchedule": "{\"enabled\": true, \"time\": \"07:00\", \"days\": [\"monday\", \"tuesday\", \"wednesday\", \"thursday\", \"friday\"]}",
  "units": "imperial",
  "shareRecipes": false,
  "language": "es",
  "timezone": "America/Los_Angeles"
}
```

**Response (201 Created):**
Same as GET response with the created preferences.

**Error Responses:**

- `400 Bad Request`: Validation errors
- `401 Unauthorized`: User not authenticated
- `409 Conflict`: User preferences already exist (use PUT to update)

---

### 3. Update User Preferences

Update the authenticated user's preferences. Only provided fields will be updated.

```http
PUT /api/v1/user-preferences
```

**Headers:**

```
Content-Type: application/json
Cookie: better-auth.session_token=<session-token>
```

**Request Body:**
All fields are optional. Only provided fields will be updated.

```json
{
  "strengthPreference": "strong",
  "cloudControlAccess": false,
  "timezone": "Europe/London",
  "theme": "light"
}
```

**Response (200 OK):**
Same as GET response with the updated preferences.

**Error Responses:**

- `400 Bad Request`: Validation errors
- `401 Unauthorized`: User not authenticated
- `404 Not Found`: User preferences not found

---

### 4. Delete User Preferences

Delete the authenticated user's preferences.

```http
DELETE /api/v1/user-preferences
```

**Headers:**

```
Cookie: better-auth.session_token=<session-token>
```

**Response (204 No Content):**
Empty response body.

**Error Responses:**

- `401 Unauthorized`: User not authenticated
- `404 Not Found`: User preferences not found

---

## Data Models

### User Preferences Object

| Field                      | Type    | Required       | Default    | Description                                 |
| -------------------------- | ------- | -------------- | ---------- | ------------------------------------------- |
| `id`                       | string  | Auto-generated | -          | Unique preference ID                        |
| `userId`                   | string  | Auto-set       | -          | ID of the user who owns these preferences   |
| `strengthPreference`       | string  | No             | `"medium"` | Coffee strength preference                  |
| `defaultCupSize`           | integer | No             | `300`      | Default cup size in milliliters (50-1000)   |
| `notificationsBrewed`      | boolean | No             | `true`     | Receive notifications when coffee is brewed |
| `notificationsMaintenance` | boolean | No             | `true`     | Receive maintenance notifications           |
| `notificationsErrors`      | boolean | No             | `true`     | Receive error notifications                 |
| `notificationMethod`       | string  | No             | `"email"`  | Preferred notification method               |
| `smsPhoneNumber`           | string  | No             | `null`     | SMS phone number (E.164 format)             |
| `allowIntegrations`        | boolean | No             | `false`    | Allow third-party integrations              |
| `cloudControlAccess`       | boolean | No             | `false`    | Allow cloud-based control access            |
| `theme`                    | string  | No             | `"auto"`   | UI theme preference                         |
| `autoBrewSchedule`         | string  | No             | `null`     | Auto-brew schedule in JSON format           |
| `units`                    | string  | No             | `"metric"` | Measurement units preference                |
| `shareRecipes`             | boolean | No             | `true`     | Allow sharing recipes publicly              |
| `language`                 | string  | No             | `"en"`     | Preferred language code                     |
| `timezone`                 | string  | No             | `"UTC"`    | IANA timezone name                          |
| `createdAt`                | string  | Auto-generated | -          | ISO 8601 timestamp                          |
| `updatedAt`                | string  | Auto-updated   | -          | ISO 8601 timestamp                          |

### Enum Values

#### Strength Preference

- `"light"`
- `"medium"`
- `"strong"`

#### Notification Method

- `"email"`
- `"sms"`
- `"push"`
- `"none"`

#### Theme

- `"light"`
- `"dark"`
- `"auto"`

#### Units

- `"metric"`
- `"imperial"`

#### Language

- `"en"` (English)
- `"es"` (Spanish)
- `"fr"` (French)
- `"de"` (German)

### Validation Rules

#### Phone Number

- **Format**: E.164 format (e.g., `+15551234567`)
- **Pattern**: `^\\+?[1-9]\\d{1,14}$`

#### Timezone

- **Format**: IANA timezone names (e.g., `America/New_York`, `Europe/London`)
- **Pattern**: `^[A-Za-z_]+/[A-Za-z_]+$`

#### Cup Size

- **Range**: 50-1000 milliliters
- **Type**: Integer

#### Auto Brew Schedule

- **Format**: JSON string
- **Example**: `"{\"enabled\": true, \"time\": \"07:00\", \"days\": [\"monday\", \"tuesday\", \"wednesday\", \"thursday\", \"friday\"]}"`

---

## Example Frontend Usage

### React/TypeScript Examples

#### Fetch User Preferences

```typescript
const fetchUserPreferences = async () => {
  try {
    const response = await fetch('/api/v1/user-preferences', {
      credentials: 'include', // Include session cookies
    });

    if (response.ok) {
      const preferences = await response.json();
      return preferences;
    } else if (response.status === 404) {
      // User has no preferences yet
      return null;
    }
    throw new Error(`Failed to fetch preferences: ${response.status}`);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    throw error;
  }
};
```

#### Create User Preferences

```typescript
const createUserPreferences = async (preferences: Partial<UserPreferences>) => {
  try {
    const response = await fetch('/api/v1/user-preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(preferences),
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error(`Failed to create preferences: ${response.status}`);
  } catch (error) {
    console.error('Error creating preferences:', error);
    throw error;
  }
};
```

#### Update User Preferences

```typescript
const updateUserPreferences = async (updates: Partial<UserPreferences>) => {
  try {
    const response = await fetch('/api/v1/user-preferences', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updates),
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error(`Failed to update preferences: ${response.status}`);
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};
```

### TypeScript Interface

```typescript
interface UserPreferences {
  id: string;
  userId: string;
  strengthPreference: 'light' | 'medium' | 'strong';
  defaultCupSize: number; // 50-1000
  notificationsBrewed: boolean;
  notificationsMaintenance: boolean;
  notificationsErrors: boolean;
  notificationMethod: 'email' | 'sms' | 'push' | 'none';
  smsPhoneNumber?: string;
  allowIntegrations: boolean;
  cloudControlAccess: boolean;
  theme: 'light' | 'dark' | 'auto';
  autoBrewSchedule?: string; // JSON string
  units: 'metric' | 'imperial';
  shareRecipes: boolean;
  language: 'en' | 'es' | 'fr' | 'de';
  timezone: string; // IANA timezone
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

---

## Error Handling

### Common Error Response Format

```json
{
  "error": "Error type",
  "message": "Human-readable error message"
}
```

### Validation Error Example

```json
{
  "error": "Validation Error",
  "message": "The request data is invalid",
  "details": [
    {
      "instancePath": "/strengthPreference",
      "keyword": "enum",
      "message": "must be equal to one of the allowed values"
    }
  ]
}
```

### Status Codes Summary

- `200 OK`: Successful GET/PUT request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Validation errors or malformed request
- `401 Unauthorized`: Authentication required
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists (for POST)

---

## Notes for Frontend Development

1. **Authentication**: All requests automatically include session cookies when using `credentials: 'include'`

2. **Initialization**: New users won't have preferences initially. Handle the 404 case gracefully.

3. **Partial Updates**: PUT requests only update provided fields. Use this for granular preference updates.

4. **Default Values**: When creating preferences, any omitted fields will use sensible defaults.

5. **Timezone Handling**: Use IANA timezone names. Consider using libraries like `date-fns-tz` or `luxon` for timezone handling.

6. **Auto Brew Schedule**: This is stored as a JSON string. Parse/stringify when working with it in the frontend.

7. **Phone Number Validation**: Validate phone numbers client-side using E.164 format before submission.

8. **Error Boundaries**: Implement proper error handling for network failures and validation errors.
