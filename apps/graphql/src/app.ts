import { createServer } from 'node:http';

import { createYoga } from 'graphql-yoga';

import { logger } from './lib/logger';
import { schema } from './schema';

export const yoga = createYoga({
  graphqlEndpoint: '/graphql',
  schema,
  context: (context) => ({
    user: null,
    ...context,
  }),
  parserAndValidationCache: true,
});

const server = createServer(yoga);

server.listen(4000, () => {
  logger.info('GraphQL server is running on http://localhost:4000/graphql');
});
