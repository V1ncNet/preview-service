import { Request, Response } from 'express';
import http, { IncomingMessage } from 'http';
import https from 'https';

// @ts-ignore
import { controller, get } from '../application/routing';
import Controller from './controller';
import { PROXY_ENDPOINT } from '../../config/endpoints';
import { proxyAuthenticationService } from '../../index';
import { atob, btoa } from '../application/base64';


@controller(PROXY_ENDPOINT)
export default class ProxyController extends Controller {

  @get('/:url')
  proxyByPath(req: Request, res: Response) {
    const decoded = atob(req.params.url);
    const url = new URL(decoded);
    const resourceHeaders = proxyAuthenticationService.authenticate(url);
    resourceHeaders.range = req.headers.range || [];

    (url.protocol === 'http:' ? http : https).get(url, { headers: resourceHeaders }, (pRes: IncomingMessage) => {
      const { headers: incomingHeaders } = pRes;
      const headers = Object.entries(incomingHeaders);

      headers.forEach(entry => {
        const { 0: key, 1: value } = entry;
        if (value) {
          res.setHeader(key, value);
        }
      });

      res.status(pRes.statusCode || 500);

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
      throw err;
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
