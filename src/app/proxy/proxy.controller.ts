import { NextFunction, Request, Response } from 'express';
import { controller, get } from '../../lib/web/bind/annotations';
import { Controller } from '../../lib/web';
import { PROXY_ENDPOINT } from '../../config/endpoints';
import { atob, btoa } from '../../lib/utils';
import { proxyFactory } from '../../index';
import { HttpError, BadGateway } from '../../lib/http';

@controller(PROXY_ENDPOINT)
export default class ProxyController extends Controller {

  @get('/:uri')
  proxyByPath(req: Request, res: Response, next: NextFunction) {
    let uri: URL;
    try {
      const decoded = atob(req.params.uri);
      uri = new URL(decoded);
    } catch (e) {
      res.status(404);
      return res.end();
    }

    const proxy = proxyFactory.from(uri);
    proxy.proxy(uri, req, res, err => {
      if (err) {
        if (err instanceof HttpError) {
          next(err);
        } else {
          next(new BadGateway(err));
        }
      }

      res.end();
    });
  }

  public static proxy(uri: string): string {
    const encoded = btoa(uri);
    return ProxyController.createProxyUri(encoded);
  }

  private static createProxyUri(encodedUri: string): string {
    return `${PROXY_ENDPOINT}/${encodedUri}`;
  }
}
