import { Request, Response } from 'express';

export interface Proxy {
  proxy: (url: URL, req: Request, res: Response, error: (err?: Error) => void) => void;
}
