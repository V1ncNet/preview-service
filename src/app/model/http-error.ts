import { Request } from 'express';


export abstract class HttpError {

  message: string;
  path: string;
  timestamp: string = new Date().toISOString();

  protected constructor(error: Error, req: Request) {
    this.message = error.message;
    this.path = req.url;
  }
}
