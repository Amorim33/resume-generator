import { makeExecutableSchema } from '@graphql-tools/schema';

import { graphqlSchema } from '@resume-generator/schema';

import { Resolvers } from './__generated__/resolvers-types';
import { GraphQLContext } from './lib/context';
import { userResolve } from './modules/user/UserResolver';

const resolvers: Resolvers = {
  Query: {
    me: { resolve: userResolve },
  },
};

export const schema = makeExecutableSchema<GraphQLContext>({
  typeDefs: graphqlSchema,
  resolvers,
});
