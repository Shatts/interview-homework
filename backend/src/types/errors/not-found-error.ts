import { BaseError } from './base-error.js';

export class NotFoundError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, 'NOT_FOUND', 404, details);
  }
}
