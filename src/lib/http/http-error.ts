import { Request } from 'express';
import { ErrorAttributes } from './error-attributes';

export abstract class HttpError implements Error, ErrorAttributes {

  name: string = 'HTTP Error';
  status: number = 500;
  error: string = 'Internal Server Error';
  message: string;
  path?: string;
  timestamp: string = new Date().toISOString();

  protected constructor(error: Error | string, req?: Request) {
    if (error instanceof Error) {
      this.name = error.name;
      this.message = error.message;
    } else {
      this.message = error;
    }

    if (req) {
      this.path = req.path;
    }
  }
}
