import { HttpError } from './http-error';
import { Request } from 'express';

export class BadRequest extends HttpError {

  status = 400;
  error = 'Bad Request';

  constructor(error: Error | string, req?: Request) {
    super(error, req);
  }
}
