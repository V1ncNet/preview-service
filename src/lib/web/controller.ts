import { Route } from './route';

export abstract class Controller {

  // @ts-ignore
  protected $routes: Route[];

  public getRoutes(): Route[] {
    if (!this.$routes) {
      throw new Error('No routes defined');
    }
    return this.$routes;
  }
}

export type ControllerClass = typeof Controller;
