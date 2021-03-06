import { Request, Response, Router } from 'express';
import { PREVIEW_ENDPOINT } from '../../constants/endpoint';
import { BadRequest } from '../../web';
import { CorsUriResolver } from '../proxy/cors-uri-resolver';
import { PdfjsViewerResources } from './pdfjs-viewer-resources';


export const router: Router = Router();

const uriResolver = new CorsUriResolver();
const viewerResources = new PdfjsViewerResources();

router.get(PREVIEW_ENDPOINT + '/pdf', (req: Request, res: Response) => {

  const url: string = String(req.query.url);

  if (typeof req.query.url !== 'string' || !url) {
    const err = new Error('Request param \'url\' must be provided');
    res.status(400).send(new BadRequest(err, req));
  }

  const proxyPath = uriResolver.resolve(url);
  const viewerUrl = viewerResources.getRedirection(proxyPath);
  return res.redirect(viewerUrl);
});
