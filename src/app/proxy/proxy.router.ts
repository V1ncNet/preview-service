import { Router, Request, Response } from 'express';
import { PROXY_ENDPOINT } from '../../constants/endpoint';
import https from 'https';
import http, { IncomingMessage } from 'http';
import { atob, btoa } from '../../utils';
import config from '../../../config.json';
import { ProxyAuthenticationService } from './auth/proxy-authentication.service';


export const router: Router = Router();

const proxyAuthenticationService = new ProxyAuthenticationService(config.proxy.auth);

router.get(PROXY_ENDPOINT + '/:url', (req: Request, res: Response) => {
  const decoded = atob(req.params.url);
  const url = new URL(decoded);
  const resourceHeaders = proxyAuthenticationService.authenticate(url);
  resourceHeaders.range = req.headers.range || [];

  (url.protocol === 'http:' ? http : https).get(url, { headers: resourceHeaders }, (pRes: IncomingMessage) => {
    const { headers: incommingHeaders } = pRes;
    const headers = Object.entries(incommingHeaders);

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
});

export function proxy(url: string): string {
  const encoded = btoa(url);
  return createProxyUrl(encoded);
}

function createProxyUrl(encodedUrl: string): string {
  return `${PROXY_ENDPOINT}/${encodedUrl}`;
}
