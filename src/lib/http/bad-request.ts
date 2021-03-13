import { ErrorAttributes } from './error-attributes';
import { HttpError } from './http-error';
import { Request } from 'express';


export class BadRequest extends HttpError implements ErrorAttributes {

  status = 400;
  error = 'Bad Request';

  constructor(error: Error, req: Request) {
    super(error, req);
  }
}
