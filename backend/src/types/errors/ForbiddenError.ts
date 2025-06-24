import { BaseError } from './BaseError.js';

export class ForbiddenError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, 'FORBIDDEN', 403, details);
  }
}
