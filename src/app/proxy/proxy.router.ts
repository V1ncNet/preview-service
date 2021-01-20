import { Router, Request, Response } from 'express';
import { PROXY_ENDPOINT } from '../../constants/endpoint';
import https from 'https';

export const router: Router = Router();

export function proxy(url: string): string {
  const encoded = btoa(url);
  return createProxyUrl(encoded);
}

function atob(url: string) {
  const buffer = Buffer.from(url, 'base64');
  return buffer.toString('utf-8');
}

function btoa(url: string): string {
  const buffer = Buffer.from(url, 'utf-8');
  return buffer.toString('base64');
}

function createProxyUrl(encodedUrl: string): string {
  return `${PROXY_ENDPOINT}/${encodedUrl}`;
}

router.get(PROXY_ENDPOINT + '/:url', (req: Request, res: Response) => {
  const decoded = atob(req.params.url);

  forward(decoded, (data, status, headers) => {
    res.type('blob');

    headers.forEach(entry => {
      const { 0: key, 1: value } = entry;
      if (value) {
        res.setHeader(key, value);
      }
    });

    res.status(status)
      .send(data);
  });
});

function forward(url: string, callback: (data: any, status: number, headers: [string, string | string[] | undefined][]) => void): void {
  const resource = new URL(url);

  const chunks: any[] = [];
  https.get(resource, res => {
    const { headers: incommingHeaders } = res;
    const headers = Object.entries(incommingHeaders);

    res.on('data', chunk => chunks.push(chunk));

    res.on('end', () => {
      const data = Buffer.concat(chunks);

      callback(data, res.statusCode as number, headers);
    });
  }).on('error', error => {
    throw error;
  }).end();
}
