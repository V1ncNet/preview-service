import { Proxy } from './proxy';
import { Request, Response } from 'express';
import path from 'path';

export class FileProxy implements Proxy {

  proxy(url: URL, req: Request, res: Response, error: (err: Error) => void): void {
    const filePath = decodeURIComponent(url.pathname);
    res.sendFile(path.basename(filePath), { root: path.dirname(filePath) }, error);
  }
}
