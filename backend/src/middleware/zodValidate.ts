import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export function zodValidateBody(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          details: err.errors,
          error: 'Validation failed',
        });
      }
      next(err);
    }
  };
}

export function zodValidateParams(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          details: err.errors,
          error: 'Validation failed',
        });
      }
      next(err);
    }
  };
}
