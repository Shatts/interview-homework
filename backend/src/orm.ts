import { MikroORM } from '@mikro-orm/core';
import { defineConfig } from '@mikro-orm/mariadb';
import { SeedManager } from '@mikro-orm/seeder';

import { dbEnv } from './config/db-env.js';
import { Product } from './repositories/product-entity.js';
import { DatabaseSeeder } from './seeders/database-seeder.js';

export default defineConfig({
  dbName: dbEnv.DB_NAME,
  debug: dbEnv.DB_DEBUG,
  entities: [Product],
  extensions: [SeedManager],
  host: dbEnv.DB_HOST,
  password: dbEnv.DB_PASSWORD,
  port: dbEnv.DB_PORT,
  seeder: {
    defaultSeeder: 'DatabaseSeeder',
    path: './seeders',
  },
  user: dbEnv.DB_USER,
});

export let orm: MikroORM | null = null;

export async function initORM(): Promise<MikroORM> {
  if (orm) return orm;

  orm = await MikroORM.init();

  // Only needed for test purposes, not in production
  if (dbEnv.DB_RESET) {
    console.warn('Resetting database schema...');
    await orm.getSchemaGenerator().refreshDatabase();
  }

  try {
    console.log('Running seeders.');
    const seeder = orm.getSeeder();
    await seeder.seed(DatabaseSeeder);
    console.log('Seeding complete.');
  } catch (error: unknown) {
    console.error('Seeding failed:', error);
  }
  // end of seeding

  return orm;
}
