import { MikroORM } from '@mikro-orm/core';
import { defineConfig } from '@mikro-orm/mariadb';
import { Product } from './entities/ProductEntity.js';
import { dbEnv } from './config/dbEnv.js';
import { Seeder, SeedManager } from '@mikro-orm/seeder';
import { DatabaseSeeder } from './seeders/DatabaseSeeder.js';

export default defineConfig({
  entities: [Product],
  dbName: dbEnv.DB_NAME,
  user: dbEnv.DB_USER,
  password: dbEnv.DB_PASSWORD,
  host: dbEnv.DB_HOST,
  port: dbEnv.DB_PORT,
  debug: dbEnv.DB_DEBUG,
  extensions: [SeedManager],
  seeder: {
    path: './seeders',
    defaultSeeder: 'DatabaseSeeder',
  },
});

export let orm: MikroORM;

export async function initORM() {
  orm = await MikroORM.init();
  await orm.getSchemaGenerator().refreshDatabase();
  const seeder = orm.getSeeder();
  await seeder.seed(DatabaseSeeder);
}
