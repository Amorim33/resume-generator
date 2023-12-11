import { createUserRepository } from '@resume-generator/domain';
import {
  MutationUserUpsertArgs,
  UserUpsertPayload,
} from '../../../__generated__/resolvers-types';
import { GraphQLContext } from '../../../lib/context';
import { userResolverSchema } from '../user-resolver';

export const userUpsertResolve = async (
  _: unknown,
  args: MutationUserUpsertArgs,
  context: GraphQLContext,
): Promise<UserUpsertPayload> => {
  const { loaders } = context;
  const { input } = args;

  if (!loaders) {
    throw new Error('Loaders not found');
  }

  const userRepository = createUserRepository(loaders.user);
  const user = await userRepository.upsert(input.user);

  return {
    me: userResolverSchema.parse(user),
    errors: [],
  };
};
