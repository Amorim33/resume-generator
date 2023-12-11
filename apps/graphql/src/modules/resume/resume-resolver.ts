import { toGlobalId } from 'graphql-relay';
import { z } from 'zod';
import {
  QueryResumesArgs,
  ResumeConnection,
} from '../../__generated__/resolvers-types';
import { GraphQLContext } from '../../lib/context';

export const resumeResolveSchema = z.object({
  id: z
    .string()
    .uuid()
    .transform((uuid) => toGlobalId('Resume', uuid)),
  html: z.string(),
});

const resumeConnectionResolverSchema = z.object({
  count: z.bigint().transform((count) => Number(count)), // TODO: Allow bigint in GraphQL
  pageInfo: z.object({
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
    startCursor: z.string().optional(),
    endCursor: z.string().optional(),
  }),
  edges: z.array(
    z.object({
      node: resumeResolveSchema,
      cursor: z.string(),
    }),
  ),
});

export const resumeConnectionResolve = async (
  _: unknown,
  args: QueryResumesArgs,
  context: GraphQLContext,
): Promise<ResumeConnection | null> => {
  return context.user
    ? resumeConnectionResolverSchema.parse(
        await context.loaders.resume.loaderByUserId.loadConnection(
          context.user,
          args,
        ),
      )
    : null;
};
