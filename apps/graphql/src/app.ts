import { createServer } from 'node:http';

import { createYoga, maskError } from 'graphql-yoga';

import {
  createResumeLoaders,
  createUserLoaders,
} from '@resume-generator/domain';
import { env } from './lib/config';
import { GraphQLContext } from './lib/context';
import { logger } from './lib/logger';
import { schema } from './schema';
import { fromGlobalId } from 'graphql-relay';

export const yoga = createYoga<GraphQLContext>({
  graphqlEndpoint: '/graphql',
  schema,
  context: async (context) => {
    if (context.user && context.loaders) {
      return context;
    }

    const userGlobalId = context.request.headers
      .get('authorization')
      ?.split(' ')[1];
    const userId = userGlobalId ? fromGlobalId(userGlobalId).id : null;
    const loaders = {
      user: createUserLoaders(),
      resume: createResumeLoaders(),
    };

    if (userId) {
      const user = await loaders.user.loaderById.load(userId);

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
    errorMessage: 'Unexpected error. Please try again.',
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
