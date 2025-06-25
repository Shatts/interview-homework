import { BaseError } from './base-error.js';

export class UnauthorizedError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, 'UNAUTHORIZED', 401, details);
  }
}
