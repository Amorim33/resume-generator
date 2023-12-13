import { randomUUID } from 'crypto';
import { sql } from 'slonik';
import { pool } from '../../../database';
import { insertUserQuery, userMock } from '../../../mock/user';
import { User } from '../dto/user-schema';
import { createUserLoaders } from '../user-loader';
import { createUserRepository } from '../user-repository';

const userRepository = createUserRepository(createUserLoaders());
const testUser: Omit<User, 'id'> = {
  email: userMock.email,
  name: userMock.name,
  contact: userMock.contact,
  about: userMock.about,
};

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
