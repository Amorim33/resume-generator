import { UserLoaders } from './user-loader';

/**
 * Factory function to create a user repository.
 *
 * @example
 *   const userRepository = createUserRepository(loaders);
 *   const user = await userRepository.findById('uuid');
 */
export const createUserRepository = (loaders: UserLoaders) => ({
  findById: (id: string) => loaders.userByIdLoader.load(id),
});
