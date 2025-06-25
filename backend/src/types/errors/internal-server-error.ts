import { BaseError } from './base-error.js';

export class InternalServerError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, 'INTERNAL_SERVER_ERROR', 500, details);
  }
}
