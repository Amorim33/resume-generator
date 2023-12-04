import { createMockQueryResult } from 'slonik';
import { randomUUID } from 'crypto';
import { User } from '../modules/user/dto/user-schema';

export const userMock: User = {
  id: randomUUID(),
  email: 'test@test.com',
  name: 'Test User',
  contact: '+5511123456789',
  about: 'I am a test user doing a great job!',
};

export const userQuery = createMockQueryResult([userMock]);
