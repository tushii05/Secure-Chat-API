import { z } from 'zod';
export const listUsersSchema = z.object({ page: z.string().optional(), perPage: z.string().optional() });
