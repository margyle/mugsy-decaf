import envConfig from './env';

export default {
  fastify: {
    logger: {
      level: envConfig.LOG_LEVEL,
      transport:
        envConfig.NODE_ENV === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
    },
    disableRequestLogging: false,
  },
  apiPrefix: '/api',
  apiVersion: 'v1',
};
