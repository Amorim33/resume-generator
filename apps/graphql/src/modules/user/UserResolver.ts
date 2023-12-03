import { toGlobalId } from 'graphql-relay';
import { z } from 'zod';
import { QueryNodeArgs, User } from '../../__generated__/resolvers-types';
import { GraphQLContext } from '../../lib/context';

export const userResolverSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .transform((uuid) => toGlobalId('User', uuid)),
    name: z.string(),
    contact: z.string(),
    about: z.string(),
  })
  .nullable();

export const userResolve = (
  _: unknown,
  __: QueryNodeArgs,
  context: GraphQLContext,
): User | null => userResolverSchema.parse(context.user);
