import { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { errorHandler } from '../../../src/middlewares/error-handler.js';
import { InternalServerError } from '../../../src/types/errors/internal-server-error.js';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      headersSent: false,
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    };
    mockNext = vi.fn();
  });

  describe('BaseError handling', () => {
    it('should handle InternalServerError', () => {
      const baseError = new InternalServerError('Something went wrong');

      errorHandler(
        baseError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Generic error handling', () => {
    it('should handle generic errors with 500 status', () => {
      const genericError = new Error('Something went wrong');

      errorHandler(
        genericError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle string errors', () => {
      const stringError = 'String error message';

      errorHandler(
        stringError,
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      });
    });
  });

  describe('Headers already sent scenario', () => {
    it('should call next() when headers are already sent', () => {
      const error = new Error('Test error');
      mockResponse.headersSent = true;

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
