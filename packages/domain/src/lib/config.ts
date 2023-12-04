import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  MOCK_DATABASE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
});

export const env = envSchema.parse(process.env);
