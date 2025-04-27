import '@fastify/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
    authorizeRoles: (roles: string[]) => any;
  }
}
