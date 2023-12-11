import { createPool, createTypeParserPreset } from 'slonik';
import { env } from './lib/config';
import { mockPool } from './mock/mock-pool';

export const pool = !env.MOCK_DATABASE
  ? await createPool(env.DATABASE_URL, {
      typeParsers: createTypeParserPreset(),
    })
  : mockPool;
