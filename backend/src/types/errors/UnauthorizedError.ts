import { BaseError } from './BaseError.js';

export class UnauthorizedError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, 'UNAUTHORIZED', 401, details);
  }
}
