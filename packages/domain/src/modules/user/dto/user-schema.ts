import { z } from 'zod';
import { timestampSchema } from '../../../lib/timestampSchema';

export const userSchema = z
  .object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string(),
    contact: z.string(),
    about: z.string(),
  })
  .merge(timestampSchema);

export type User = z.infer<typeof userSchema>;
