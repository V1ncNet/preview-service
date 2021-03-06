import { ErrorAttributes } from './error-attributes';
import { Request } from 'express';
import { HttpError } from './http-error';


export class InternalServerError extends HttpError implements ErrorAttributes {

  status = 500;
  error = 'Internal Server Error';

  constructor(error: Error, req: Request) {
    super(error, req);
  }
}
