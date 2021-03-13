import { Request, Response, NextFunction } from 'express';
import http, { IncomingMessage } from 'http';
import https from 'https';
import { controller, get } from '../../lib/web/bind/annotations';
import { Controller } from '../../lib/web';
import { PROXY_ENDPOINT } from '../../config/endpoints';
import { proxyAuthenticationService } from '../../index';
import { atob, btoa } from '../../lib/utils';
import { BadGateway } from '../../lib/http';

@controller(PROXY_ENDPOINT)
export default class ProxyController extends Controller {

  @get('/:url')
  proxyByPath(req: Request, res: Response, next: NextFunction) {
    let url: URL;
    try {
      const decoded = atob(req.params.url);
      url = new URL(decoded);
    } catch (e) {
      return res.status(404);
    }

    const resourceHeaders = proxyAuthenticationService.authenticate(url);
    resourceHeaders.range = req.headers.range || [];

    (url.protocol === 'http:' ? http : https).get(url, { headers: resourceHeaders }, (pRes: IncomingMessage) => {
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
    }).on('error', (err: Error) => {
      next(new BadGateway(err));
    }).end();
  }

  public static proxy(url: string): string {
    const encoded = btoa(url);
    return ProxyController.createProxyUrl(encoded);
  }

  private static createProxyUrl(encodedUrl: string): string {
    return `${PROXY_ENDPOINT}/${encodedUrl}`;
  }
}
