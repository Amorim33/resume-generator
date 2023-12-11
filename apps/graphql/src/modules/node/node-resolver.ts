import { fromGlobalId } from 'graphql-relay';
import {
  NodeResolvers,
  QueryNodeArgs,
} from '../../__generated__/resolvers-types';
import { GraphQLContext } from '../../lib/context';
import { resumeResolveSchema } from '../resume/resume-resolver';
import { userResolverSchema } from '../user/user-resolver';

const resolverSchemaMapping = {
  user: userResolverSchema,
  resume: resumeResolveSchema.nullable(),
};

export const nodeResolve = async (
  _: unknown,
  args: QueryNodeArgs,
  context: GraphQLContext,
) => {
  if (!context.user || !args.id) {
    return null;
  }

  const { type, id } = fromGlobalId(args.id);
  // TODO: Improve type safety
  const loader = type.toLowerCase() as keyof GraphQLContext['loaders'];

  if (!(loader in context.loaders)) {
    throw new Error(`Loader ${loader} not found`);
  }

  const nodeSchema = resolverSchemaMapping[loader];
  const node = await context.loaders[loader].loaderById.load(id);

  if (loader === 'user' && node.id !== context.user.id) {
    return null;
  }

  return nodeSchema.parse(node);
};

enum ResolverTypeMapping {
  User = 'User',
  Resume = 'Resume',
}

export const nodeResolverType: NodeResolvers['__resolveType'] = (node) => {
  const { type } = fromGlobalId(node.id);

  if (type !== 'User' && type !== 'Resume') {
    throw new Error(`Unknown type ${type}`);
  }

  return ResolverTypeMapping[type];
};
