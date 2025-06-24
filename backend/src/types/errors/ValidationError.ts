import { BaseError } from './BaseError.js';

export class ValidationError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}
