import { NextFunction, Request, Response } from 'express';
import { controller, get } from '../../lib/web/bind/annotations';
import { Controller } from '../../lib/web';
import { PROXY_ENDPOINT } from '../../config/endpoints';
import { atob, btoa } from '../../lib/utils';
import { proxyFactory } from '../../index';
import { BadGateway } from '../../lib/http';

@controller(PROXY_ENDPOINT)
export default class ProxyController extends Controller {

  @get('/:url')
  proxyByPath(req: Request, res: Response, next: NextFunction) {
    let url: URL;
    try {
      const decoded = atob(req.params.url);
      url = new URL(decoded);
    } catch (e) {
      res.status(404);
      return res.end();
    }

    const proxy = proxyFactory.create(url);
    proxy.proxy(url, req, res, err => {
      if (err) {
        next(new BadGateway(err));
      }
      res.end();
    });
  }

  public static proxy(url: string): string {
    const encoded = btoa(url);
    return ProxyController.createProxyUrl(encoded);
  }

  private static createProxyUrl(encodedUrl: string): string {
    return `${PROXY_ENDPOINT}/${encodedUrl}`;
  }
}
