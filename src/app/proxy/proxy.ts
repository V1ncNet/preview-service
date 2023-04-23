import { Request, Response } from 'express';

export interface Proxy {
  proxy: (uri: URL, req: Request, res: Response, error: (err?: Error) => void) => void;
}
