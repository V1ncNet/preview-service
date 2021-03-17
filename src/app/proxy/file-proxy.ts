import { Proxy } from './proxy';
import { Request, Response } from 'express';
import path from 'path';
import config from '../../config';

export class FileProxy implements Proxy {

  proxy(url: URL, req: Request, res: Response, error: (err?: Error) => void): void {
    const filePath = decodeURIComponent(url.pathname);
    const storageRoot = config.server.storageRoot;
    const filename = path.normalize(filePath);

    res.sendFile(filename, { root: storageRoot }, error);
  }
}
