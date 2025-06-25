export class BaseError extends Error {
  public code: string;
  public details?: unknown;
  public status?: number;

  constructor(
    message: string,
    code: string,
    status?: number,
    details?: unknown,
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
