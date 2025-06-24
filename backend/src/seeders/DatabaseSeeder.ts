import { Seeder } from '@mikro-orm/seeder';
import { Product } from '../entities/ProductEntity.js';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    for (let i = 1; i <= 20; i++) {
      em.create(Product, {
        name: `Product ${i}`,
        description: `Description for product ${i}`,
        imageUrl: `https://picsum.photos/seed/${i}/200/200`,
        quantity: Math.floor(Math.random() * 100) + 1,
        unitPrice: Math.floor(Math.random() * 1000) / 10,
      });
    }
  }
}
