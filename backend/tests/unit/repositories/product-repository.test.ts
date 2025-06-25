import { EntityManager } from '@mikro-orm/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductRepository } from '../../../src/repositories/product-repository.js';
import { InternalServerError } from '../../../src/types/errors/internal-server-error.js';
import { ValidationError } from '../../../src/types/errors/validation-error.js';

describe('ProductRepository error handling', () => {
  const mockEm = {
    assign: vi.fn(),
    create: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    persistAndFlush: vi.fn(),
    removeAndFlush: vi.fn(),
  } as unknown as EntityManager;

  let repo: ProductRepository;

  beforeEach(() => {
    repo = new ProductRepository(mockEm);
  });

  it('throws ValidationError for ORM ValidationError', async () => {
    const err = new Error('Invalid data');
    err.name = 'ValidationError';
    vi.spyOn(mockEm, 'find').mockRejectedValue(err);

    await expect(repo.getAll()).rejects.toThrowError(ValidationError);
  });

  it('throws ValidationError for UniqueConstraintViolationException', async () => {
    const err = new Error('Duplicate key');
    err.name = 'UniqueConstraintViolationException';
    mockEm.create = vi.fn();
    mockEm.persistAndFlush = vi.fn().mockRejectedValue(err);

    await expect(
      repo.create({
        description: 'test',
        imageUrl: 'test',
        name: 'test',
        quantity: 1,
        unitPrice: 1,
      }),
    ).rejects.toThrowError(ValidationError);
  });

  it('throws InternalServerError for ECONNREFUSED', async () => {
    const err = new Error('ECONNREFUSED something');
    vi.spyOn(mockEm, 'findOne').mockRejectedValue(err);

    await expect(repo.getById(1)).rejects.toThrowError(InternalServerError);
  });

  it('throws InternalServerError for timeout', async () => {
    const err = new Error('timeout error occurred');
    vi.spyOn(mockEm, 'removeAndFlush').mockRejectedValue(err);
    repo.getById = vi.fn().mockResolvedValue({});

    await expect(repo.delete(1)).rejects.toThrowError(InternalServerError);
  });

  it('throws InternalServerError for unexpected error object', async () => {
    vi.spyOn(mockEm, 'find').mockRejectedValue('Some unknown failure');

    await expect(repo.getAll()).rejects.toThrowError(InternalServerError);
  });
});
