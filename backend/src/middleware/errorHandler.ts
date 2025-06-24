import { NextFunction, Request, Response } from 'express';

import { BaseError } from '../types/errors/BaseError.js';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  console.log(res, 'response');
  if (res.headersSent) {
    next(err);
  }
  if (err instanceof BaseError) {
    res.status(err.status ?? 500).json({
      code: err.code,
      details: err.details,
      message: err.message,
    });
  }
  res.status(500).json({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
  });
}
