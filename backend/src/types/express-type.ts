import { Request, Response } from 'express';

export type TypedRequestBody<T> = Omit<Request, 'body'> & { body: T };

export type TypedResponse<T> = Omit<Response, 'json'> & {
  json: (body: T) => TypedResponse<T>;
};
