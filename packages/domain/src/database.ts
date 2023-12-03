import { createPool, createTypeParserPreset } from 'slonik';
import { env } from './lib/config';

export const pool = await createPool(env.DATABASE_URL, {
  typeParsers: createTypeParserPreset(),
});
