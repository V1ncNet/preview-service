import { Request, Response } from 'express';

// @ts-ignore
import { controller, get } from '../application/routing';
import Controller from './controller';
import { BadRequest } from '../model';
import { uriResolver, viewerResources } from '../../index';
import { PREVIEW_ENDPOINT } from '../application/endpoints';

@controller(PREVIEW_ENDPOINT)
export default class PreviewController extends Controller {

  @get('/pdf')
  pdf(req: Request, res: Response) {
    const url: string = String(req.query.url);

    if (typeof req.query.url !== 'string' || !url) {
      const err = new Error('Request param \'url\' must be provided');
      res.status(400).send(new BadRequest(err, req));
    }

    const proxyPath = uriResolver.resolve(url);
    const viewerUrl = viewerResources.getRedirection(proxyPath);
    return res.redirect(viewerUrl);
  }
}
