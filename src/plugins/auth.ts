// plugins/auth.ts
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { auth } from '../auth';
declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string;
      email: string;
      name?: string;
      // Add other user properties as needed
    };
    session?: {
      id: string;
      userId: string;
      expiresAt: Date;
      // Add other session properties as needed
    };
  }
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
    getUser: (request: FastifyRequest) => Promise<void>;
  }
}

const authPlugin: FastifyPluginAsync = async (fastify, opts) => {
  console.log('🚀 Auth plugin is loading...');
  console.log('🔧 Plugin options:', opts);
  console.log('🌐 Fastify prefix:', fastify.prefix);
  // Auth handler function
  async function authHandler(request: FastifyRequest, reply: FastifyReply) {
    console.log('🔥 Auth handler called for:', request.method, request.url);
    try {
      // Construct request URL
      const url = new URL(request.url, `http://${request.headers.host}`);
      console.log('📍 Constructed URL:', url.toString());

      // Convert Fastify headers to standard Headers object
      const headers = new Headers();
      Object.entries(request.headers).forEach(([key, value]) => {
        if (value) headers.append(key, value.toString());
      });

      // Create Fetch API-compatible request
      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        body: request.body ? JSON.stringify(request.body) : undefined,
      });

      console.log('🚀 Calling Better Auth handler...');
      // Process authentication request
      const response = await auth.handler(req);
      console.log('✅ Better Auth response status:', response.status);

      // Forward response to client
      reply.status(response.status);
      response.headers.forEach((value, key) => reply.header(key, value));
      reply.send(response.body ? await response.text() : null);
    } catch (error) {
      console.error('💥 Auth handler error:', error);
      fastify.log.error('Authentication Error:', error);
      reply.status(500).send({
        error: 'Internal authentication error',
        code: 'AUTH_FAILURE',
      });
    }
  }

  // Register the catch-all with specific methods (no OPTIONS to avoid CORS conflict)
  fastify.route({
    method: ['GET', 'POST'],
    url: '/*',
    handler: authHandler,
  });

  // Middleware to check authentication (throws if not authenticated)
  const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Get session from cookies OR authorization header (both supported)
      const sessionToken =
        request.cookies?.['better-auth.session_token'] ||
        request.headers.authorization?.replace('Bearer ', '');

      if (!sessionToken) {
        reply.status(401).send({ error: 'No session token' });
        return;
      }

      // Verify session with Better Auth
      const session = await auth.api.getSession({
        headers: request.headers as any,
      });

      if (!session) {
        reply.status(401).send({ error: 'Invalid session' });
        return;
      }

      // Attach user and session to request
      request.user = session.user;
      request.session = session.session;
    } catch (error) {
      fastify.log.error('Authentication middleware error:', error);
      reply.status(401).send({ error: 'Authentication failed' });
    }
  };

  // Middleware to get user without throwing (optional auth)
  const getUser = async (request: FastifyRequest) => {
    try {
      const session = await auth.api.getSession({
        headers: request.headers as any,
      });

      if (session) {
        request.user = session.user;
        request.session = session.session;
      }
    } catch (error) {
      // Silently fail - user is not authenticated
      fastify.log.debug('User not authenticated:', error);
    }
  };

  // Decorate fastify instance
  fastify.decorate('authenticate', authenticate);
  fastify.decorate('getUser', getUser);

  // Optional: Add some utility routes
  fastify.get(
    '/me',
    {
      preHandler: authenticate,
    },
    async (request, reply) => {
      return {
        user: request.user,
        session: request.session,
      };
    },
  );

  fastify.get('/status', async (request, reply) => {
    await getUser(request);

    return {
      isAuthenticated: !!request.user,
      user: request.user || null,
    };
  });
};

export default fp(authPlugin, {
  name: 'auth',
});
