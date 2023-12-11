import { z } from 'zod';

export const resumeSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  html: z.string(),
});

export type Resume = z.infer<typeof resumeSchema>;
