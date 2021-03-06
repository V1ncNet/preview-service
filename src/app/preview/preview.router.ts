import { Router, Request, Response } from 'express';
import { PREVIEW_ENDPOINT } from '../../constants/endpoint';
import config from '../../../config.json';
import { countOccurrencesOf, nCopies } from '../../utils';
import { BadRequest } from '../../web';
import { CorsUriResolver } from '../proxy/cors-uri-resolver';

export const router: Router = Router();

const uriResolver = new CorsUriResolver();

router.get(PREVIEW_ENDPOINT + '/pdf', (req: Request, res: Response) => {

  const url: string = String(req.query.url);

  if (typeof req.query.url !== 'string' || !url) {
    const err = new Error('Request param \'url\' must be provided')
    res.status(400).send(new BadRequest(err, req));
  }

  const proxyPath = uriResolver.resolve(url);
  const { uri: pdfViewerUri } = config.resources.pdf.viewer;
  const pathOffset = calcRelativePathOffset(pdfViewerUri);
  const options = config.resources.pdf.viewer.options || { };

  const queryString = new URLSearchParams({ file: proxyPath });
  const hashString = new URLSearchParams({ ...options });
  const viewerUrl = `${pdfViewerUri}?${queryString}#${hashString}`;

  return res.redirect(viewerUrl);
});

function calcRelativePathOffset(path: string): string {
  if (!path.startsWith('/')) {
    path = '/' + path;
  }

  const count = countOccurrencesOf(path, 'g');
  return nCopies(count - 1, '..').join('/');
}
