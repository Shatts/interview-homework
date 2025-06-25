import { EntityManager } from '@mikro-orm/core';
import { Request, Response } from 'express';
import { Container } from 'inversify';
import { Mocked, vi } from 'vitest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ProductController } from '../../src/controllers/product-controller.js';
import { ProductRepository } from '../../src/repositories/product-repository.js';
import { ProductService } from '../../src/services/product-service.js';
import { TYPES } from '../../src/types/container-dependencies.js';

describe('ProductController Integration with ORM Mock', () => {
  let container: Container;
  let controller: ProductController;
  let mockEm: Mocked<EntityManager>;

  let req: Partial<Request>;
  let res: Partial<Response>;

  const product = {
    description: 'Mocked Description',
    id: 1,
    name: 'Mocked Product',
    quantity: 5,
    unitPrice: 10.5,
  };

  const mockCreateInput = {
    description: 'A new product',
    imageUrl: 'https://example.com/new-image.jpg',
    name: 'New Product',
    quantity: 5,
    unitPrice: 19.99,
  };

  const mockUpdateInput = {
    name: 'Updated Product',
    quantity: 15,
  };

  beforeEach(() => {
    container = new Container();
    // @ts-expect-error - Mocking EntityManager
    mockEm = {
      assign: vi.fn(),
      create: vi.fn(),
      createQueryBuilder: vi.fn(),
      find: vi.fn().mockResolvedValue([product]),
      findOne: vi.fn(),
      persistAndFlush: vi.fn(),
      removeAndFlush: vi.fn(),
    } as unknown as EntityManager;
    const repository = new ProductRepository(mockEm);
    const service = new ProductService(repository);
    container.bind(TYPES.ProductRepository).toConstantValue(repository);
    container.bind(TYPES.ProductService).toConstantValue(service);
    controller = new ProductController(service);
    req = {
      body: {},
      params: {},
      query: {},
    };
    res = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /products', () => {
    it('should return all products successfully', async () => {
      await controller.getAll(res as Response);

      expect(res.json).toHaveBeenCalledWith([product]);
    });

    it('should return empty array when no products exist', async () => {
      vi.spyOn(mockEm, 'find').mockResolvedValue([]);

      await controller.getAll(res as Response);

      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should handle DB errors', async () => {
      vi.spyOn(mockEm, 'find').mockRejectedValueOnce(new Error('DB error'));

      await expect(() => controller.getAll(res as Response)).rejects.toThrow(
        'Unexpected failure during product retrieval',
      );
    });
  });

  describe('GET /products/:id', () => {
    it('should return product by id successfully', async () => {
      const productId = 1;
      vi.spyOn(mockEm, 'findOne').mockResolvedValue(product);

      await controller.getById(productId, res as Response);

      expect(res.json).toHaveBeenCalledWith(product);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should handle product not found', async () => {
      const productId = 999;
      vi.spyOn(mockEm, 'findOne').mockResolvedValue(null);

      await expect(() =>
        controller.getById(productId, res as Response),
      ).rejects.toThrow('Product not found');
    });

    it('should handle service errors', async () => {
      const productId = 1;
      const error = new Error('Database error');
      vi.spyOn(mockEm, 'findOne').mockRejectedValue(error);

      await expect(() =>
        controller.getById(productId, res as Response),
      ).rejects.toThrow('Unexpected failure during product retrieval');
    });
  });

  describe('POST /products', () => {
    it('should create product successfully', async () => {
      vi.spyOn(mockEm, 'create').mockResolvedValue({
        ...mockCreateInput,
        id: 2,
      });
      vi.spyOn(mockEm, 'persistAndFlush').mockResolvedValue({});
      req.body = mockCreateInput;

      await controller.create(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ ...mockCreateInput, id: 2 });
    });

    it('should handle service errors during creation', async () => {
      req.body = mockCreateInput;
      const error = new Error('Database constraint violation');
      vi.spyOn(mockEm, 'create').mockRejectedValue(error);

      await expect(() =>
        controller.create(req as Request, res as Response),
      ).rejects.toThrow('Database constraint violation');
    });

    it('should handle duplicate product creation', async () => {
      req.body = mockCreateInput;
      const error = new Error('Duplicate entry');
      vi.spyOn(mockEm, 'create').mockRejectedValue(error);

      await expect(() =>
        controller.create(req as Request, res as Response),
      ).rejects.toThrow('Duplicate entry');
    });
  });

  describe('PUT /products/:id', () => {
    it('should update product successfully', async () => {
      const productId = 1;
      const updatedProduct = { ...product, ...mockUpdateInput };
      vi.spyOn(mockEm, 'findOne').mockResolvedValue(updatedProduct);
      vi.spyOn(mockEm, 'assign').mockResolvedValue(updatedProduct);
      vi.spyOn(mockEm, 'persistAndFlush').mockResolvedValue(updatedProduct);
      req.body = mockUpdateInput;

      await controller.update(productId, req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(updatedProduct);
    });

    it('should handle product not found during update', async () => {
      const productId = 999;
      req.body = mockUpdateInput;
      vi.spyOn(mockEm, 'findOne').mockResolvedValue(null);

      await expect(() =>
        controller.update(productId, req as Request, res as Response),
      ).rejects.toThrow('Product not found');
    });

    it('should handle service errors during update', async () => {
      const productId = 1;
      req.body = mockUpdateInput;
      const error = new Error('Database error during update');
      vi.spyOn(mockEm, 'findOne').mockRejectedValue(error);

      await expect(() =>
        controller.update(productId, req as Request, res as Response),
      ).rejects.toThrow('Unexpected failure during product creation');
    });
  });

  describe('PATCH /products/:id', () => {
    it('should patch product successfully', async () => {
      const productId = 1;
      const patchData = { quantity: 25 };
      const patchedProduct = { ...product, quantity: 25 };
      vi.spyOn(mockEm, 'findOne').mockResolvedValue(patchedProduct);
      vi.spyOn(mockEm, 'assign').mockResolvedValue(patchedProduct);
      vi.spyOn(mockEm, 'persistAndFlush').mockResolvedValue(patchedProduct);
      req.body = patchData;

      await controller.patch(productId, req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(patchedProduct);
    });

    it('should handle product not found during patch', async () => {
      const productId = 999;
      const patchData = { name: 'Patched Name' };
      req.body = patchData;
      vi.spyOn(mockEm, 'findOne').mockResolvedValue(null);

      await expect(() =>
        controller.patch(productId, req as Request, res as Response),
      ).rejects.toThrow('Product not found');
    });

    it('should handle validation errors in patch body', async () => {
      const productId = 1;
      const invalidPatchData = { unitPrice: -10 };
      req.body = invalidPatchData;

      await expect(() =>
        controller.patch(productId, req as Request, res as Response),
      ).rejects.toThrow();
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete product successfully', async () => {
      const productId = 1;
      vi.spyOn(mockEm, 'findOne').mockResolvedValue(product);
      vi.spyOn(mockEm, 'removeAndFlush').mockResolvedValue({});

      await controller.delete(productId, res as Response);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ message: 'Deleted' });
    });

    it('should handle product not found during deletion', async () => {
      const productId = 999;
      vi.spyOn(mockEm, 'findOne').mockResolvedValue(null);

      await expect(() =>
        controller.delete(productId, res as Response),
      ).rejects.toThrow('Product not found');
    });

    it('should handle service errors during deletion', async () => {
      const productId = 1;
      const error = new Error('Database constraint violation');
      vi.spyOn(mockEm, 'findOne').mockResolvedValue(product);
      vi.spyOn(mockEm, 'removeAndFlush').mockRejectedValue(error);

      await expect(() =>
        controller.delete(productId, res as Response),
      ).rejects.toThrow('Unexpected failure during product deletion');
    });
  });
});
