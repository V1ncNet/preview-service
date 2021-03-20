import { Application } from 'express';
import { ControllerClass, Route } from '../web';
import controllers from '../../app';
import config from '../../config';

export class Router {

  constructor(private _controllers: ControllerClass[]) { }

  public static async getDefault(): Promise<Router> {
    const controllers$ = await controllers();
    return new Router(controllers$);
  }

  public static getEmptyRouter(): Router {
    return new Router([]);
  }

  public route(app: Application): void {
    if (this._controllers.length <= 0) {
      throw new Error('No controller associated with this router');
    }
    this._controllers.forEach((controller) => {
      // @ts-ignore
      const instance = new controller();
      instance.getRoutes().forEach((route: Route) => {
        const { fnName, method, url, middleware } = route;
        // @ts-ignore
        app[method](config.server.contextPath + url, middleware, instance[fnName]);
      });
    });
  }
}
