import { Router, Request, Response } from 'express';
import { PROXY_ENDPOINT } from '../../constants/endpoint';
import https from 'https';
import http, { IncomingMessage } from 'http';
import { atob } from '../../utils';
import config from '../../../config.json';
import { ProxyAuthenticationService } from './auth/proxy-authentication.service';


export const router: Router = Router();

interface HttpResponse {
  data: any;
  status: number;
  headers: [string, string | string[] | undefined][];
}

const proxyAuthenticationService = new ProxyAuthenticationService(config.proxy.auth);

router.get(PROXY_ENDPOINT + '/:url', (req: Request, res: Response) => {
  const decoded = atob(req.params.url);

  forward(decoded, (httpResponse: HttpResponse) => {
    const { data, status, headers } = httpResponse;

    if (status != 200) {
      return res.status(status).send();
    }

    headers.forEach(entry => {
      const { 0: key, 1: value } = entry;
      if (value) {
        res.setHeader(key, value);
      }
    });

    res.status(200)
      .send(data);
  });
});

function forward(url: string, callback: (httpResponse: HttpResponse) => void): void {
  const resource = new URL(url);

  const resourceHeaders = proxyAuthenticationService.authenticate(resource);

  const chunks: any[] = [];
  (resource.protocol === 'http:' ? http : https).get(resource, { headers: resourceHeaders }, (res: IncomingMessage) => {
    const { headers: incommingHeaders } = res;
    const headers = Object.entries(incommingHeaders);

    res.on('data', chunk => chunks.push(chunk));

    res.on('end', () => {
      const data = Buffer.concat(chunks);

      callback({
        data,
        status: res.statusCode || 500,
        headers,
      });
    });
  }).on('error', (error: Error) => {
    throw error;
  }).end();
}
