import { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z, ZodError } from 'zod';

import {
  zodValidateBody,
  zodValidateParams,
} from '../../../src/middlewares/zod-validator.js';

describe.only('Zod Validator Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
    };
    mockResponse = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    };
    mockNext = vi.fn();
  });

  describe('zodValidateBody', () => {
    const userSchema = z.object({
      age: z.number().min(18, 'Must be at least 18'),
      email: z.string().email('Invalid email'),
      name: z.string().min(1, 'Name is required'),
    });

    it('should validate valid body and call next()', () => {
      const validBody = {
        age: 25,
        email: 'john@example.com',
        name: 'John Doe',
      };
      mockRequest.body = validBody;

      const middleware = zodValidateBody(userSchema);
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.body).toEqual(validBody);
      expect(mockNext).toHaveBeenCalledWith();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should handle validation errors and return 400 status', () => {
      const invalidBody = {
        age: 16,
        email: 'invalid-email',
        name: '',
      };
      mockRequest.body = invalidBody;

      const middleware = zodValidateBody(userSchema);
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        details: expect.any(Array) as ZodError[],
        error: 'Validation failed',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle missing required fields', () => {
      const incompleteBody = {
        name: 'John Doe',
        // email and age missing
      };
      mockRequest.body = incompleteBody;

      const middleware = zodValidateBody(userSchema);
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        details: expect.any(Array) as ZodError[],
        error: 'Validation failed',
      });
    });

    it('should handle wrong data types', () => {
      const wrongTypesBody = {
        age: '25', // should be number
        email: 'john@example.com',
        name: 123, // should be string
      };
      mockRequest.body = wrongTypesBody;

      const middleware = zodValidateBody(userSchema);
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        details: expect.any(Array) as ZodError[],
        error: 'Validation failed',
      });
    });

    it('should handle empty body', () => {
      mockRequest.body = {};

      const middleware = zodValidateBody(userSchema);
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        details: expect.any(Array) as ZodError[],
        error: 'Validation failed',
      });
    });

    it('should handle null body', () => {
      mockRequest.body = null;

      const middleware = zodValidateBody(userSchema);
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        details: expect.any(Array) as ZodError[],
        error: 'Validation failed',
      });
    });
  });

  describe('zodValidateParams', () => {
    const paramsSchema = z.object({
      category: z.enum(['electronics', 'clothing', 'books']),
      id: z.string().uuid('Invalid UUID'),
      page: z.string().transform((val) => parseInt(val, 10)),
    });

    it('should validate valid params and call next()', () => {
      const validParams = {
        category: 'electronics',
        id: '123e4567-e89b-12d3-a456-426614174000',
        page: '1',
      };
      mockRequest.params = validParams;

      const middleware = zodValidateParams(paramsSchema);
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.params).toEqual({
        category: 'electronics',
        id: '123e4567-e89b-12d3-a456-426614174000',
        page: 1, // transformed to number
      });
      expect(mockNext).toHaveBeenCalledWith();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should handle validation errors and return 400 status', () => {
      const invalidParams = {
        category: 'invalid-category',
        id: 'invalid-uuid',
        page: 'not-a-number',
      };
      mockRequest.params = invalidParams;

      const middleware = zodValidateParams(paramsSchema);
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        details: expect.any(Array) as ZodError[],
        error: 'Validation failed',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle missing required params', () => {
      const incompleteParams = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        // category and page missing
      };
      mockRequest.params = incompleteParams;

      const middleware = zodValidateParams(paramsSchema);
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        details: expect.any(Array) as ZodError[],
        error: 'Validation failed',
      });
    });

    it('should handle empty params', () => {
      mockRequest.params = {};

      const middleware = zodValidateParams(paramsSchema);
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        details: expect.any(Array) as ZodError[],
        error: 'Validation failed',
      });
    });
  });
});
