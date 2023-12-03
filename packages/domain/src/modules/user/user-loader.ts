import { sql } from 'slonik';
import { createNodeByIdLoaderClass } from 'slonik-dataloaders';
import { userSchema } from './dto/user-schema';
import { pool } from '../../database';

const UserByIdLoader = createNodeByIdLoaderClass({
  column: {
    name: 'id',
    type: 'uuid',
  },
  query: sql.type(userSchema)`
    SELECT
      *
    FROM users
  `,
});

export type UserLoaders = {
  userByIdLoader: InstanceType<typeof UserByIdLoader>;
};

/**
 * Factory function for instantiating user loaders.
 *
 * @example
 *   context: (context) => {
 *     return {
 *       ...context,
 *       loaders: createUserLoaders(),
 *     };
 *   };
 */
export const createUserLoaders = (): UserLoaders => ({
  userByIdLoader: new UserByIdLoader(pool),
});
