import { createServer } from 'node:http';

import { createYoga } from 'graphql-yoga';

import { logger } from './lib/logger';
import { schema } from './schema';
import { GraphQLContext } from './lib/context';
import { createUserLoaders } from '@resume-generator/domain';

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
  parserAndValidationCache: true,
});

const server = createServer(yoga);

server.listen(4000, () => {
  logger.info('GraphQL server is running on http://localhost:4000/graphql');
});
