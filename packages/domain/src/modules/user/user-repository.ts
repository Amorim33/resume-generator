import { sql } from 'slonik';
import { pool } from '../../database';
import { User, userSchema } from './dto/user-schema';
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
  upsert: async (user: Omit<User, 'id'>) => {
    const updatedUser = await pool.connect(async (connection) => {
      return connection.one(sql.type(userSchema)`
        INSERT INTO users (email, name, contact, about) VALUES (${user.email}, ${user.name}, ${user.contact}, ${user.about})
        ON CONFLICT (email) DO UPDATE SET name = ${user.name}, contact = ${user.contact}, about = ${user.about}
        RETURNING *;
      `);
    });

    loaders.userByIdLoader.clear(updatedUser.id);
    loaders.userByIdLoader.prime(updatedUser.id, updatedUser);

    return updatedUser;
  },
});
