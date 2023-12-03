import { sql } from 'slonik';
import { userSchema } from './dto/user-schema';
import { pool } from '../../database';

export const userRepository = {
  findById: async (id: string) => {
    const query = sql.type(userSchema)`
        SELECT * FROM users WHERE id = ${id}
    `;
    return pool.connect((connection) => {
      return connection.maybeOne(query);
    });
  },
};
