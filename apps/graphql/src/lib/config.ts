import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test']).default('development'),
  LOG_LEVEL: z
    .enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
    .default('info'),
});

export const env = envSchema.parse(process.env);
