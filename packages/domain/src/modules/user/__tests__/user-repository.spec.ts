import { sql } from 'slonik';
import { randomUUID } from 'crypto';
import { pool } from '../../../database';
import { userSchema } from '../dto/user-schema';
import { createUserRepository } from '../user-repository';
import { createUserLoaders } from '../user-loader';

const userRepository = createUserRepository(createUserLoaders());
const testUser = {
  email: 'test@test.com',
  name: 'Test User',
  contact: '1234567890',
  about: 'About Test User',
};

const insertUserQuery = sql.type(userSchema)`
    INSERT INTO users (email, name, contact, about)
    VALUES (
      ${testUser.email},
      ${testUser.name},
      ${testUser.contact},
      ${testUser.about}
    )
    RETURNING *;
`;

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
    return connection.one(insertUserQuery);
  });
  const foundUser = await userRepository.findById(insertedUser.id);

  expect(foundUser).toEqual(insertedUser);
});

it('returns null if user is not found', async () => {
  const foundUser = await userRepository.findById(randomUUID());
  expect(foundUser).toBeNull();
});

it('creates a new user', async () => {
  const user = await userRepository.upsert(testUser);
  expect(user).toMatchObject(testUser);
});

it('updates an existing user', async () => {
  const insertedUser = await pool.connect((connection) => {
    return connection.one(insertUserQuery);
  });
  const updatedUser = await userRepository.upsert({
    ...testUser,
    name: 'Updated User',
  });

  expect(updatedUser).toMatchObject({
    ...insertedUser,
    name: 'Updated User',
  });
});
