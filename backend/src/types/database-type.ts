import { z } from 'zod';

export const dbEnvSchema = z.object({
  DB_DEBUG: z.coerce.boolean().default(false),
  DB_HOST: z.string().default('localhost'),
  DB_NAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_PORT: z.coerce.number().default(3306),
  DB_RESET: z.coerce.boolean().default(false),
  DB_USER: z.string(),
});
