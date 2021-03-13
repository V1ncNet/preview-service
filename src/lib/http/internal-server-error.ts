import { Request } from 'express';
import { HttpError } from './http-error';

export class InternalServerError extends HttpError {

  status = 500;
  error = 'Internal Server Error';

  constructor(error: Error | string, req?: Request) {
    super(error, req);
  }
}
