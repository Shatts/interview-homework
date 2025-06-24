import { EntityManager } from '@mikro-orm/core';
import { Product } from '../entities/ProductEntity.js';
import { injectable, inject } from 'inversify';
import { ProductCreateInput } from '../types/Product.js';

@injectable()
export class ProductRepository {
  constructor(@inject(EntityManager) private em: EntityManager) {}

  async getAll(): Promise<Product[]> {
    return this.em.find(Product, {});
  }

  async getById(id: number): Promise<Product | null> {
    return this.em.findOne(Product, { id });
  }

  async create(data: ProductCreateInput): Promise<Product> {
    const product = this.em.create(Product, data);
    await this.em.persistAndFlush(product);
    return product;
  }

  async update(id: number, data: Partial<Product>): Promise<Product | null> {
    const product = await this.getById(id);
    if (!product) return null;
    this.em.assign(product, data);
    await this.em.persistAndFlush(product);
    return product;
  }

  async delete(id: number): Promise<boolean> {
    const product = await this.getById(id);
    if (!product) return false;
    await this.em.removeAndFlush(product);
    return true;
  }
}
