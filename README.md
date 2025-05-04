# DECAF - Does Every Coffee Action, Friend

A Fastify TypeScript backend for Mugsy

## Features

- **Modern Stack**: Built with Fastify, TypeScript, and Drizzle ORM
- **Organized Architecture**: Feature-based organization with clear separation of concerns
- **Database Integration**: SQLite with Drizzle ORM and migration support
- **Security**: JWT authentication, role-based access control, and security headers
- **Documentation**: API documentation with Swagger/OpenAPI and Scalar API Reference
- **Configuration**: Environment-specific configurations for dev/staging/prod
- **Recipe Management**: Create and manage coffee recipes with step-by-step brewing instructions

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/your-organization/decaf-backend.git
   cd decaf-backend
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables

   ```bash
   cp .env.example .env
   ```

4. Generate and apply database migrations

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

The server will be available at http://localhost:3000 with hot reloading enabled.



## Project Structure

```
/src
├── config/               # Environment and app configuration
├── db/                   # Database setup with Drizzle ORM
├── features/             # Feature modules (auth, cats, etc.)
│   ├── feature-name/     # Each feature has its own directory
│   │   ├── schema.ts     # JSON Schema for requests and responses
│   │   ├── routes.ts     # Route definitions and API endpoints
│   │   ├── handlers.ts   # Request handlers with business logic
│   │   └── index.ts      # Feature registration
├── plugins/              # Fastify plugins (auth, cors, etc.)
├── types/                # TypeScript type definitions
├── utils/                # Utilities (error handling, logging, etc.)
├── app.ts                # Fastify app setup
└── server.ts             # Server entry point
```

## Development Commands

| Command                 | Description                                  |
| ----------------------- | -------------------------------------------- |
| `npm run dev`           | Start the development server with hot reload |
| `npm run build`         | Build the application for production         |
| `npm run start`         | Start the production server                  |
| `npm run db:generate`   | Generate database migrations                 |
| `npm run db:migrate`    | Apply database migrations                    |
| `npm run db:studio`     | Open Drizzle Studio UI (port 8000)           |
| `npm run lint`          | Run ESLint                                   |
| `npm run lint:fix`      | Fix ESLint issues                            |
| `npm run format`        | Format code with Prettier                    |
| `npm test`              | Run the full test suite                      |
| `npm run test:watch`    | Run tests in watch mode                      |
| `npm run test:coverage` | Generate test coverage report                |

# Testing

Tests use Vitest, Fastify's `inject`, and an in-memory SQLite DB with Drizzle migrations applied automatically via `tests/setup.ts`.

Note: the in-memory DB is created directly in `tests/setup.ts` (using `:memory:`) and passed into `buildApp`—so you don't need a `.env.test` for the database setup.

1. (Optional) Create a `.env.test` file for overrides:
   ```bash
   cp .env.example .env.test
   ```
2. Run all tests:
   ```bash
   npm test
   ```
3. Run tests in watch mode:
   ```bash
   npm run test:watch
   ```
4. Generate a coverage report:
   ```bash
   npm run test:coverage
   ```

## Key Components

### Configuration (`src/config/`)

Manages environment-specific settings:

- `env.ts` - Environment variables
- `app.ts` - Application configuration
- `db.ts` - Database configuration

Usage:

```typescript
import { envConfig, appConfig, dbConfig } from './config';

// Access configuration values
const port = envConfig.PORT;
```

### Database (`src/db/`)

The database layer uses Drizzle ORM with SQLite:

- Schema defined in `src/db/schema/`
- Migrations stored in `/drizzle/`
- Connection setup in `src/db/index.ts`

Drizzle Studio can be used to visualize and manage data:

```bash
npm run db:studio -- --port 8000
```

### Features (`src/features/`)

Each feature is isolated and contains everything it needs:

- **Cats Feature**: Example feature to use as a tutorial for feature creation
- **Auth Feature**: Handles user registration, login, and authentication
- **Recipes Feature**: Manages coffee recipes and their brewing steps

Adding a new feature:

1. Create a directory under `src/features/`
2. Implement schema.ts (request/response schemas), routes.ts, and handlers.ts
3. Register the feature in `src/features/index.ts`

### Plugins (`src/plugins/`)

Fastify plugins that extend functionality:

- **Auth Plugin**: JWT authentication and role-based access control
- **CORS Plugin**: Cross-origin resource sharing configuration
- **Helmet Plugin**: Security headers
- **Swagger Plugin**: API documentation
- **Error Handler**: Centralized error handling

### Utils (`src/utils/`)

Utility functions and helpers:

- **Error Handling**: Custom error classes and helpers in `src/utils/errors.ts`
- **Logging**: Centralized logging in `src/utils/logger.ts`

## Authentication

DECAF uses JWT for authentication with role-based access control.

### Basic Flow

1. Register a user: `POST /api/v1/auth/register`
2. Login to get a token: `POST /api/v1/auth/login`
3. Include the token in subsequent requests via the `Authorization` header

### Development vs Production

- **Development**: Authentication is fully enabled but relaxed (long-lived tokens)
- **Production**: Tightened security (strong secrets, shorter token lifetimes)

For detailed authentication documentation, see [docs/authentication.md](docs/authentication.md).

### Testing Authentication

```bash
# Register a user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'

# Login to get a token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'

# Use the token
curl -X GET http://localhost:3000/api/v1/cats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## API Documentation

API documentation is available at:

- Swagger UI: `/documentation` in development mode
- Scalar API Reference: `/reference` in development mode (modern interface)

## Recipes API

The Recipe API allows for managing coffee recipes and their brewing steps.

### Recipe Endpoints

| Method | Endpoint              | Description         | Auth Required |
| ------ | --------------------- | ------------------- | ------------- |
| GET    | `/api/v1/recipes`     | Get all recipes     | No            |
| GET    | `/api/v1/recipes/:id` | Get recipe by ID    | No            |
| POST   | `/api/v1/recipes`     | Create a new recipe | Yes           |
| PUT    | `/api/v1/recipes/:id` | Update a recipe     | Yes           |
| DELETE | `/api/v1/recipes/:id` | Delete a recipe     | Yes           |

### Recipe Step Endpoints

| Method | Endpoint                    | Description                | Auth Required |
| ------ | --------------------------- | -------------------------- | ------------- |
| GET    | `/api/v1/recipes/:id/steps` | Get all steps for a recipe | No            |
| GET    | `/api/v1/recipes/steps/:id` | Get step by ID             | No            |
| POST   | `/api/v1/recipes/steps`     | Create a new recipe step   | Yes           |
| PUT    | `/api/v1/recipes/steps/:id` | Update a recipe step       | Yes           |
| DELETE | `/api/v1/recipes/steps/:id` | Delete a recipe step       | Yes           |

### Recipe Model

```typescript
{
  id: string;
  created_by?: string;           // User ID of the creator
  name: string;                  // Recipe name
  description?: string;          // Recipe description
  coffee_weight: number;         // Weight of coffee in grams
  water_weight: number;          // Weight of water in grams
  water_temperature: number;     // Water temperature in celsius
  grind_size?: string;           // Description of grind size
  brew_time: number;             // Total brew time in seconds
}
```

### Recipe Step Model

```typescript
{
  id: string;
  recipe_id: string;             // ID of the parent recipe
  step_order: number;            // Order of the step
  duration_sec?: number;         // Duration of the step in seconds
  command_parameter?: number;    // Numeric parameter for the command
  command_type: string;          // Command type (move, grind, pour, wait, measure, other)
}
```

### Example: Creating a Recipe

```bash
# Create a recipe
curl -X POST http://localhost:3000/api/v1/recipes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Classic Pour Over",
    "description": "Simple and clean pour over method",
    "coffee_weight": 20,
    "water_weight": 300,
    "water_temperature": 92,
    "grind_size": "Medium-fine",
    "brew_time": 180
  }'

# Add a step to the recipe
curl -X POST http://localhost:3000/api/v1/recipes/steps \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "recipe_id": "RECIPE_ID_FROM_ABOVE",
    "step_order": 1,
    "duration_sec": 30,
    "command_type": "pour",
    "command_parameter": 60
  }'
```

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Make changes
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Branch Protection

To ensure code quality and a smooth workflow, we enforce these protections in GitHub:

### Protected Branches

- `dev` and `main` are both protected.  
- Direct pushes are disabled—all changes must go through Pull Requests.

### Status Checks

- Every PR to `dev` runs the **CI → Lint → Build → Test w/ Coverage** workflow.  
- Every PR to `main` runs the **Ensure only-dev → Test w/ Coverage** workflow, and also verifies the source branch is `dev`.  
- Merging is only allowed when these checks pass.

### Merge Strategy

- Squash merges are enforced for a clean history.  
- (Optional) **Require branches to be up to date before merging** is enabled so PRs always test against the latest code.

### Pull Request Reviews

- Require at least one approval before merging.
