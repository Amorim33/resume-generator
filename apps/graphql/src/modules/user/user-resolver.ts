import { toGlobalId } from 'graphql-relay';
import { z } from 'zod';
import { User } from '../../__generated__/resolvers-types';
import { GraphQLContext } from '../../lib/context';

export const userResolverSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .transform((uuid) => toGlobalId('User', uuid)),
    name: z.string(),
    email: z.string().email(),
    contact: z.string(),
    about: z.string(),
  })
  .nullable();

export const userResolve = (
  _: unknown,
  __: unknown,
  context: GraphQLContext,
): User | null => userResolverSchema.parse(context.user);
