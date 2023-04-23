import { Proxy } from './proxy';
import { Request, Response } from 'express';
import path from 'path';
import config from '../../config';

export class FileProxy implements Proxy {

  proxy(uri: URL, req: Request, res: Response, error: (err?: Error) => void): void {
    const filePath = decodeURIComponent(uri.pathname);
    const storageRoot = config.server.storageRoot;
    const filename = path.normalize(filePath);

    res.sendFile(filename, { root: storageRoot }, error);
  }
}
