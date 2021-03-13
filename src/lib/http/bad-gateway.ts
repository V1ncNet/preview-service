import { HttpError } from './http-error';
import { Request } from 'express';

export class BadGateway extends HttpError {

  status = 502;
  error = 'Bad Gateway';

  constructor(error: Error | string, req?: Request) {
    super(error, req);
  }
}
