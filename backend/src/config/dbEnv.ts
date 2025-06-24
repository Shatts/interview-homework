import { dbEnvSchema } from '../types/Database.js';

export const dbEnv = dbEnvSchema.parse(process.env);
