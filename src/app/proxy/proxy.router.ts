import { Router, Request, Response } from 'express';
import { PROXY_ENDPOINT } from '../../constants/endpoint';
import https from 'https';
import { IncomingMessage, OutgoingHttpHeaders } from 'http';
import { atob, btoa } from '../../utils';

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

  const chunks: any[] = [];
  https.get(resource, (res: IncomingMessage) => {
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
