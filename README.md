# DECAF - Does Every Coffee Action, Friend

A modern Fastify TypeScript backend for coffee robot systems, providing robust API services with best practices for security, authentication, and database management.

## Features

- **Modern Stack**: Built with Fastify, TypeScript, and Drizzle ORM
- **Organized Architecture**: Feature-based organization with clear separation of concerns
- **Database Integration**: SQLite with Drizzle ORM and migration support
- **Security**: JWT authentication, role-based access control, and security headers
- **Developer Experience**: Comprehensive error handling and logging
- **Documentation**: API documentation with Swagger/OpenAPI
- **Configuration**: Environment-specific configurations for dev/staging/prod

## Quick Start

### Prerequisites

- Node.js 18.x or higher
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
│   │   ├── schema.ts     # JSON Schema validation
│   │   ├── routes.ts     # Route definitions
│   │   ├── handlers.ts   # Request handlers
│   │   ├── service.ts    # Business logic
│   │   ├── hooks.ts      # Pre/post hooks
│   │   └── index.ts      # Feature registration
├── plugins/              # Fastify plugins (auth, cors, etc.)
├── types/                # TypeScript type definitions
├── utils/                # Utilities (error handling, logging, etc.)
├── app.ts                # Fastify app setup
└── server.ts             # Server entry point
```

## Development Commands

| Command               | Description                                  |
| --------------------- | -------------------------------------------- |
| `npm run dev`         | Start the development server with hot reload |
| `npm run build`       | Build the application for production         |
| `npm run start`       | Start the production server                  |
| `npm run db:generate` | Generate database migrations                 |
| `npm run db:migrate`  | Apply database migrations                    |
| `npm run db:studio`   | Open Drizzle Studio UI (port 8000)           |
| `npm run lint`        | Run ESLint                                   |
| `npm run lint:fix`    | Fix ESLint issues                            |
| `npm run format`      | Format code with Prettier                    |

## Key Components

### Configuration (`src/config/`)

Manages environment-specific settings:

- `env.ts` - Environment variables
- `app.ts` - Application configuration
- `db.ts` - Database configuration

Usage:

```typescript
import { envConfig, appConfig, dbConfig } from "./config";

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

- **Cats Feature**: Example feature that manages cat data
- **Auth Feature**: Handles user registration, login, and authentication

Adding a new feature:

1. Create a directory under `src/features/`
2. Implement schema, routes, handlers, and service
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
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'

# Login to get a token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'

# Use the token
curl -X GET http://localhost:3000/api/v1/cats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## API Documentation

API documentation is available at `/documentation` in development mode.

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Make changes and add tests
3. Run tests (`npm test`)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
