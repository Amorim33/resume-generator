import { randomUUID } from 'crypto';
import { createMockQueryResult, sql } from 'slonik';
import { User, userSchema } from '../modules/user/dto/user-schema';

export const userMock: User = {
  id: randomUUID(),
  email: 'test@test.com',
  name: 'Test User',
  contact: '+5511123456789',
  about: 'I am a test user doing a great job!',
};

export const userQuery = createMockQueryResult([userMock]);

export const insertUserQuery = sql.type(userSchema)`
    INSERT INTO users (email, name, contact, about)
    VALUES (
      ${userMock.email},
      ${userMock.name},
      ${userMock.contact},
      ${userMock.about}
    )
    RETURNING *;
`;
