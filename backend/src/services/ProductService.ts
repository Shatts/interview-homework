import { inject, injectable } from 'inversify';
import { ProductRepository } from '../repositories/ProductRepository.js';
import { Product, ProductCreateInput, ProductUpdateInput } from '../types/Product.js';
import { TYPES } from '#container.js';

@injectable()
export class ProductService {
  constructor(
    @inject(TYPES.ProductRepository) private productRepository: ProductRepository,
  ) {}

  async getAll(): Promise<Product[]> {
    return this.productRepository.getAll();
  }

  async getById(id: number): Promise<Product | null> {
    return this.productRepository.getById(id);
  }

  async create(data: ProductCreateInput): Promise<Product> {
    return this.productRepository.create(data);
  }

  async update(id: number, data: ProductUpdateInput): Promise<Product | null> {
    return this.productRepository.update(id, data);
  }

  async delete(id: number): Promise<boolean> {
    return this.productRepository.delete(id);
  }
}
