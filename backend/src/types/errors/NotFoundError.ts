import { BaseError } from './BaseError.js';

export class NotFoundError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, 'NOT_FOUND', 404, details);
  }
}
