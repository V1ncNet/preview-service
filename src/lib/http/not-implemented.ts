import { HttpError } from './http-error';
import { Request } from 'express';

export class NotImplemented extends HttpError {

  status = 501;
  error = 'Not Implemented';

  constructor(error: Error | string, req?: Request) {
    super(error, req);
  }
}
