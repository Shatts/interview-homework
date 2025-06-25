import { NotFoundError } from '@mikro-orm/core';
import { inject, injectable } from 'inversify';

import { ProductRepository } from '../repositories/product-repository.js';
import {
  Product,
  ProductCreateInput,
  ProductUpdateInput,
} from '../types/product-type.js';
import { TYPES } from '../types/container-dependencies.js';

const ProductNotFoundError = new NotFoundError('Product not found');

@injectable()
export class ProductService {
  constructor(
    @inject(TYPES.ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async create(data: ProductCreateInput): Promise<Product> {
    return this.productRepository.create(data);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.productRepository.delete(id);
    if (!result) {
      throw ProductNotFoundError;
    }
    return result;
  }

  async getAll(): Promise<Product[]> {
    return this.productRepository.getAll();
  }

  async getById(id: number): Promise<Product> {
    const product = await this.productRepository.getById(id);
    if (!product) {
      throw ProductNotFoundError;
    }
    return product;
  }

  async update(id: number, data: ProductUpdateInput): Promise<Product> {
    const product = await this.productRepository.update(id, data);
    if (!product) {
      throw ProductNotFoundError;
    }
    return product;
  }
}
