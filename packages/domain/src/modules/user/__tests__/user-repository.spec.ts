import { sql } from 'slonik';
import { randomUUID } from 'crypto';
import { pool } from '../../../database';
import { userSchema } from '../dto/user-schema';
import { createUserRepository } from '../user-repository';
import { createUserLoaders } from '../user-loader';

const userRepository = createUserRepository(createUserLoaders());

beforeEach(async () => {
  await pool.connect(async (connection) => {
    await connection.query(sql.unsafe`
        BEGIN;
    `);
  });
});

afterEach(async () => {
  await pool.connect(async (connection) => {
    await connection.query(sql.unsafe`
        ROLLBACK;
    `);
  });
});

it('finds a user by id', async () => {
  const insertedUser = await pool.connect((connection) => {
    return connection.one(sql.type(userSchema)`
        INSERT INTO users (email, name, contact, about)
        VALUES (
            'test@test.com',
            'Test User',
            '1234567890',
            'About Test User'
        )
        RETURNING *;
    `);
  });
  const foundUser = await userRepository.findById(insertedUser.id);

  expect(foundUser).toEqual(insertedUser);
});

it('returns null if user is not found', async () => {
  const foundUser = await userRepository.findById(randomUUID());
  expect(foundUser).toBeNull();
});
