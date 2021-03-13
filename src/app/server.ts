import express, { Application, ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from 'express';
import http from 'http';
import { Router } from '../lib/web';
import config from '../config';
import { HttpError, NotFoundError } from '../lib/http';


interface IRouteOptions {
  notFoundCallback?: RequestHandler;
  errorHandler?: ErrorRequestHandler;
}

export default class Server {

  private readonly _app: Application;
  private readonly _server: http.Server;
  private _router: Router;
  private readonly _middleware: RequestHandler[];
  private _port: number | string;
  private _running: boolean;

  constructor(router: Router = Router.getEmptyRouter()) {
    this._app = express();
    this._server = http.createServer(this._app);
    this._router = router;
    this._middleware = [];
    this._port = config.port;
    this._running = false;
  }

  public use(...middleware: RequestHandler[]): void {
    this._middleware.push(...middleware);
  }

  public get app(): Application {
    return this._app;
  }

  public get server(): http.Server {
    return this._server;
  }

  public set port(port: number | string) {
    this.checkRunning();
    this._port = port;
  }

  private checkRunning(): void {
    if (this._running) {
      throw new Error('Server is already _running.');
    }
  }

  public static async getDefault(): Promise<Server> {
    const router = await Router.getDefault();
    return new Server(router);
  }

  private route({ notFoundCallback = Server.notFound, errorHandler = Server.errorHandler }: IRouteOptions = {}): void {
    this._app.use(this._middleware);
    this._router.route(this._app);

    this._app.use(notFoundCallback);
    this._app.use(errorHandler);
  }

  private listen(): void {
    this._server.listen(this._port, () => {
      this._running = true;
      console.log('Express application started on port: ' + this._port);
    });
  }

  public start(): void {
    this.checkRunning();
    this.route();
    this.listen();
  }

  private static notFound(req: Request, res: Response, next: NextFunction): void {
    if (res.status(404)) {
      return next(new NotFoundError(new Error('Resource not found'), req));
    }
  }

  private static errorHandler(err: Error | HttpError, req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    return res.status(err.status || 500).json(err);
  }
}
