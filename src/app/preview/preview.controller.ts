import { Request, Response } from 'express';
import { controller, get } from '../../lib/web/bind/annotations';
import { Controller } from '../../lib/web';
import { BadRequest } from '../../lib/http';
import { uriResolver, viewerResources } from '../../index';
import { PREVIEW_ENDPOINT } from '../../config/endpoints';

@controller(PREVIEW_ENDPOINT)
export default class PreviewController extends Controller {

  @get('/pdf')
  pdf(req: Request, res: Response) {
    const uri: string = String(req.query.uri);

    if (typeof req.query.uri !== 'string' || !uri) {
      throw new BadRequest('Required parameter \'uri\' is not present', req);
    }

    const proxyPath = uriResolver.resolve(uri);
    const viewerUri = viewerResources.getRedirection(proxyPath);
    return res.redirect(viewerUri);
  }

  @get('/native')
  native(req: Request, res: Response) {
    const uri: string = String(req.query.uri);

    if (typeof req.query.uri !== 'string' || !uri) {
      throw new BadRequest('Required parameter \'uri\' is not present', req);
    }

    const proxyPath = uriResolver.resolve(uri);
    return res.redirect(proxyPath);
  }
}
