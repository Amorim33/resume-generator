import { z } from 'zod';

/**
 * Timestamp schema.
 *
 * @example
 *   export const resourceSchema = z
 *     .object({
 *       id: z.string().uuid(),
 *     })
 *     .merge(timestampSchema);
 */
export const timestampSchema = z.object({
  created_at: z.number().describe('The timestamp for the record creation.'),
});
