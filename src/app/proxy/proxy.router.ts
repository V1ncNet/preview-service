import { Router, Request, Response } from 'express';
import { PROXY_ENDPOINT } from '../../constants/endpoint';
import https from 'https';
import http, { IncomingMessage } from 'http';
import { atob, btoa } from '../../utils';
import config from '../../../config.json';
import { ProxyAuthorizationService } from './auth/proxy-authorization.service';


export const router: Router = Router();

export function proxy(url: string): string {
  const encoded = btoa(url);
  return createProxyUrl(encoded);
}

function createProxyUrl(encodedUrl: string): string {
  return `${PROXY_ENDPOINT}/${encodedUrl}`;
}

interface HttpResponse {
  data: any;
  status: number;
  headers: [string, string | string[] | undefined][];
}

const proxyAuthorizationService = new ProxyAuthorizationService(config.proxy.auth);

router.get(PROXY_ENDPOINT + '/:url', (req: Request, res: Response) => {
  const decoded = atob(req.params.url);

  forward(decoded, (httpResponse: HttpResponse) => {
    const { data, status, headers } = httpResponse;

    headers.forEach(entry => {
      const { 0: key, 1: value } = entry;
      if (value) {
        res.setHeader(key, value);
      }
    });

    res.type('blob');
    res.status(status)
      .send(data);
  });
});

function forward(url: string, callback: (httpResponse: HttpResponse) => void): void {
  const resource = new URL(url);

  const resourceHeaders = proxyAuthorizationService.authorize(resource);

  const chunks: any[] = [];
  (resource.protocol === 'http:' ? http : https).get(resource, { headers: resourceHeaders }, (res: IncomingMessage) => {
    const { headers: incommingHeaders } = res;
    const headers = Object.entries(incommingHeaders);

    res.on('data', chunk => chunks.push(chunk));

    res.on('end', () => {
      const data = Buffer.concat(chunks);

      callback({
        data,
        status: res.statusCode as number,
        headers,
      });
    });
  }).on('error', (error: Error) => {
    throw error;
  }).end();
}
