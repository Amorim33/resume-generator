import { createMockPool, createPool, createTypeParserPreset } from 'slonik';
import { env } from './lib/config';
import { userQuery } from './mock/user';

export const pool = !env.MOCK_DATABASE
  ? await createPool(env.DATABASE_URL, {
      typeParsers: createTypeParserPreset(),
    })
  : createMockPool({
      query: async () => userQuery,
    });
