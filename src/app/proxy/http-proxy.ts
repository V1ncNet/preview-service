import { Proxy } from './proxy';
import { ClientRequest, IncomingMessage, RequestOptions } from 'http';
import { Request, Response } from 'express';
import { proxyAuthenticationService } from '../../index';

export class HttpProxy implements Proxy {

  constructor(private get: (uri: string | URL, options: RequestOptions, callback?: (res: IncomingMessage) => void) => ClientRequest) { }

  proxy(uri: URL, req: Request, res: Response, error: (err?: Error) => void): void {
    const resourceHeaders = proxyAuthenticationService.authenticate(uri);
    resourceHeaders.range = req.headers.range || [];

    this.get(uri, { headers: resourceHeaders }, (pRes: IncomingMessage) => {
      if (pRes.statusCode != 200) {
        res.status(pRes.statusCode || 500);
        pRes.resume();
        return res.end();
      }

      const { headers: incomingHeaders } = pRes;
      const headers = Object.entries(incomingHeaders);
      headers.forEach(entry => {
        const { 0: key, 1: value } = entry;
        if (value) {
          res.setHeader(key, value);
        }
      });

      pRes.on('data', chunk => {
        res.write(chunk);
      });

      pRes.on('close', () => {
        res.end();
      });

      pRes.on('end', () => {
        res.end();
      });
    }).on('error', error)
      .end();
  }
}
