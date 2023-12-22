import { z } from 'zod';
import { timestampSchema } from '../../../lib/timestampSchema';

export const resumeSchema = z
  .object({
    id: z.string().uuid(),
    user_id: z.string().uuid(), // TODO: add userId alias
    html: z.string(),
  })
  .merge(timestampSchema);

export type Resume = z.infer<typeof resumeSchema>;
