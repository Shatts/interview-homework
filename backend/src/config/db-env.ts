import { dbEnvSchema } from '../types/database-type.js';

export const dbEnv = dbEnvSchema.parse(process.env);
