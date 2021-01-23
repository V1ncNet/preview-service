import { Router, Request, Response } from 'express';
import { PREVIEW_ENDPOINT, PROXY_ENDPOINT } from '../../constants/endpoint';
import config from '../../../config.json';
import { countOccurrencesOf, nCopies } from '../../utils';
import { btoa } from '../../utils';

export const router: Router = Router();

function proxy(url: string): string {
  const encoded = btoa(url);
  return createProxyUrl(encoded);
}

function createProxyUrl(encodedUrl: string): string {
  return `${PROXY_ENDPOINT}/${encodedUrl}`;
}

router.get(PREVIEW_ENDPOINT + '/pdf', (req: Request, res: Response) => {

  const url: string = String(req.query.url);

  if (!url) {
    return res.status(400).send({
      message: 'Request param [url] must be provided'
    });
  }

  const proxyPath = proxy(url);
  const { uri: pdfViewerUri } = config.resources.pdf.viewer;
  const pathOffset = calcRelativePathOffset(pdfViewerUri);
  const options = config.resources.pdf.viewer.options || { };

  const queryString = new URLSearchParams({ file: pathOffset + proxyPath, ...options })
  const viewerUrl = `${pdfViewerUri}?${queryString}`;

  return res.redirect(viewerUrl);
});

function calcRelativePathOffset(path: string): string {
  if (!path.startsWith('/')) {
    path = '/' + path;
  }

  const count = countOccurrencesOf(path, 'g');
  return nCopies(count - 1, '..').join('/');
}
