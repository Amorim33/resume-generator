import { makeExecutableSchema } from '@graphql-tools/schema';

import { graphqlSchema } from '@resume-generator/schema';

import { Resolvers } from './__generated__/resolvers-types';
import { GraphQLContext } from './lib/context';
import { userResolve } from './modules/user/user-resolver';
import { userUpsertResolve } from './modules/user/mutations/user-upsert-resolver';
import { resumeConnectionResolve } from './modules/resume/resume-resolver';
import { nodeResolve, nodeResolverType } from './modules/node/node-resolver';

const resolvers: Resolvers = {
  Query: {
    node: { resolve: nodeResolve },
    me: { resolve: userResolve },
    resumes: { resolve: resumeConnectionResolve },
  },
  Mutation: {
    UserUpsert: { resolve: userUpsertResolve },
  },
  Node: {
    __resolveType: nodeResolverType,
  },
};

export const schema = makeExecutableSchema<GraphQLContext>({
  typeDefs: graphqlSchema,
  resolvers,
});
