import { makeExecutableSchema } from '@graphql-tools/schema';

import { graphqlSchema } from '@resume-generator/schema';

import { Resolvers } from './__generated__/resolvers-types';
import { GraphQLContext } from './lib/context';
import { userResolve } from './modules/user/user-resolver';
import { userUpsertResolve } from './modules/user/mutations/user-upsert-resolver';

const resolvers: Resolvers = {
  Query: {
    me: { resolve: userResolve },
  },
  Mutation: {
    UserUpsert: { resolve: userUpsertResolve },
  },
};

export const schema = makeExecutableSchema<GraphQLContext>({
  typeDefs: graphqlSchema,
  resolvers,
});
