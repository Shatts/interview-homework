import { EntityManager } from '@mikro-orm/core';
import { inject, injectable } from 'inversify';

import { InternalServerError } from '../types/errors/internal-server-error.js';
import { ValidationError } from '../types/errors/validation-error.js';
import { ProductCreateInput } from '../types/product-type.js';
import { Product } from './product-entity.js';

@injectable()
export class ProductRepository {
  constructor(@inject(EntityManager) private em: EntityManager) {}

  async create(data: ProductCreateInput): Promise<Product> {
    try {
      const product = this.em.create(Product, data);
      await this.em.persistAndFlush(product);
      return product;
    } catch (err) {
      this.handleOrmError(err, 'product creation');
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const product = await this.getById(id);
      if (!product) return false;
      await this.em.removeAndFlush(product);
      return true;
    } catch (err) {
      this.handleOrmError(err, 'product deletion');
    }
  }

  async getAll(): Promise<Product[]> {
    try {
      return await this.em.find(Product, {});
    } catch (err) {
      this.handleOrmError(err, 'product retrieval');
    }
  }

  async getById(id: number): Promise<null | Product> {
    try {
      return await this.em.findOne(Product, { id });
    } catch (err) {
      this.handleOrmError(err, 'product retrieval');
    }
  }

  handleOrmError(err: unknown, context = 'operation'): never {
    if (err instanceof Error) {
      if (err.name === 'ValidationError') {
        throw new ValidationError(
          `Validation failed during ${context}: ${err.message}`,
        );
      }

      if (err.name === 'UniqueConstraintViolationException') {
        throw new ValidationError(
          `Duplicate field during ${context}: ${err.message}`,
        );
      }

      if (
        err.message.includes('ECONNREFUSED') ||
        err.message.includes('timeout')
      ) {
        throw new InternalServerError(
          `Database connection issue during ${context}`,
        );
      }
    }

    throw new InternalServerError(`Unexpected failure during ${context}`);
  }

  async update(id: number, data: Partial<Product>): Promise<null | Product> {
    try {
      const product = await this.getById(id);
      if (!product) return null;
      this.em.assign(product, data);
      await this.em.persistAndFlush(product);
      return product;
    } catch (err) {
      this.handleOrmError(err, 'product creation');
    }
  }
}
