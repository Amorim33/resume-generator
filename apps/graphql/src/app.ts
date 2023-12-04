import { createServer } from 'node:http';

import { createYoga, maskError } from 'graphql-yoga';

import { createUserLoaders } from '@resume-generator/domain';
import { env } from './lib/config';
import { GraphQLContext } from './lib/context';
import { logger } from './lib/logger';
import { schema } from './schema';

export const yoga = createYoga<GraphQLContext>({
  graphqlEndpoint: '/graphql',
  schema,
  context: async (context) => {
    if (context.user && context.loaders) {
      return context;
    }

    const userId = context.request.headers.get('authorization')?.split(' ')[1];
    const loaders = createUserLoaders();

    if (userId) {
      const user = await loaders.userByIdLoader.load(userId);

      return {
        ...context,
        user,
        loaders,
      };
    }

    return {
      ...context,
      user: null,
      loaders,
    };
  },
  logging: logger,
  maskedErrors: {
    errorMessage: 'Internal server error.',
    maskError: (error, message, isDev) => {
      logger.error(error, message);
      // TODO: Send error to Sentry when in production.
      return maskError(error, message, isDev);
    },
  },
  parserAndValidationCache: true,
});

const server = createServer(yoga);

if (env.NODE_ENV === 'development') {
  server.listen(4000, () => {
    logger.info('GraphQL server is running on http://localhost:4000/graphql');
  });
}
