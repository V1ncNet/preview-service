import { ErrorAttributes } from './error-attributes';
import { Request } from 'express';
import { HttpError } from './http-error';


export class NotFoundError extends HttpError implements ErrorAttributes {

  status = 404;
  error = 'Not Found';

  constructor(error: Error, req: Request) {
    super(error, req);
  }
}
