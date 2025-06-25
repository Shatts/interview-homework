import { NotFoundError } from '@mikro-orm/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductRepository } from '../../../src/repositories/product-repository.js';
import { ProductService } from '../../../src/services/product-service.js';
import { Product } from '../../../src/types/product-type.js';

describe('ProductService', () => {
  const mockProductRepository = {
    create: vi.fn(),
    delete: vi.fn(),
    getAll: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
  } as unknown as ProductRepository;

  let service: ProductService;

  beforeEach(() => {
    service = new ProductService(mockProductRepository);
  });

  describe('getAll()', () => {
    it('should returns products', async () => {
      const mockProducts = [
        {
          description: 'A',
          id: 1,
          imageUrl: 'A',
          name: 'A',
          quantity: 1,
          unitPrice: 1,
        },
      ] as Product[];
      const spy = vi
        .spyOn(mockProductRepository, 'getAll')
        .mockResolvedValue(mockProducts);

      const result = await service.getAll();

      expect(result).toBe(mockProducts);
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('getById()', () => {
    it('should return product if found', async () => {
      const mockProduct = { id: 1, name: 'Test' } as Product;
      vi.spyOn(mockProductRepository, 'getById').mockResolvedValue(mockProduct);

      const result = await service.getById(1);

      expect(result).toBe(mockProduct);
    });

    it('should throw NotFoundError if not found', async () => {
      vi.spyOn(mockProductRepository, 'getById').mockResolvedValue(null);

      await expect(() => service.getById(99)).rejects.toThrowError(
        new NotFoundError('Product not found'),
      );
    });
  });

  describe('create()', () => {
    it('should create and return product', async () => {
      const mockProduct = {
        description: 'New',
        id: 2,
        imageUrl: 'New',
        name: 'New',
        quantity: 1,
        unitPrice: 1,
      };
      const spy = vi
        .spyOn(mockProductRepository, 'create')
        .mockResolvedValue(mockProduct);

      const result = await service.create(mockProduct);

      expect(result).toBe(mockProduct);
      expect(spy).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe('update()', () => {
    it('should update and return product', async () => {
      const updatedProduct = {
        description: 'Updated',
        id: 1,
        imageUrl: 'Updated',
        name: 'Updated',
        quantity: 1,
        unitPrice: 1,
      };
      vi.spyOn(mockProductRepository, 'update').mockResolvedValue(
        updatedProduct,
      );

      const result = await service.update(1, { name: 'Updated' });

      expect(result).toBe(updatedProduct);
    });

    it('should throw NotFoundError if update fails', async () => {
      vi.spyOn(mockProductRepository, 'update').mockResolvedValue(null);

      await expect(() => service.update(1, { name: 'X' })).rejects.toThrowError(
        new NotFoundError('Product not found'),
      );
    });
  });

  describe('delete()', () => {
    it('delete() returns true when successful', async () => {
      vi.spyOn(mockProductRepository, 'delete').mockResolvedValue(true);

      const result = await service.delete(1);

      expect(result).toBe(true);
    });

    it('delete() throws NotFoundError if delete fails', async () => {
      vi.spyOn(mockProductRepository, 'delete').mockResolvedValue(false);

      await expect(() => service.delete(1)).rejects.toThrowError(
        new NotFoundError('Product not found'),
      );
    });
  });
});
