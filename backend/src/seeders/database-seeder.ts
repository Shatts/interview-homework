import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import { Product } from '../repositories/product-entity.js';

export class DatabaseSeeder extends Seeder {
  run(em: EntityManager): void {
    for (let i = 1; i <= 20; i++) {
      em.create(Product, {
        description: `Description for product ${i.toString()}`,
        imageUrl: `https://picsum.photos/seed/${i.toString()}/200/200`,
        name: `Product ${i.toString()}`,
        quantity: Math.floor(Math.random() * 100) + 1,
        unitPrice: Math.floor(Math.random() * 1000) / 10,
      });
    }
  }
}
