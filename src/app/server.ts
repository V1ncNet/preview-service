import express, { Application, ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from 'express';
import http from 'http';
import { Router } from '../lib/web';
import config from '../config';
import { DefaultErrorAttributes, HttpError, InternalServerError, NotFoundError } from '../lib/http';

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
      throw new Error('Server is already running');
    }
  }

  public static async getDefault(): Promise<Server> {
    const router = await Router.getDefault();
    return new Server(router);
  }

  private route({ notFoundCallback = Server.notFound, errorHandler = Server.errorHandler }: IRouteOptions = { }): void {
    this._app.use(this._middleware);
    this._router.route(this._app);

    this._app.use(notFoundCallback);
    this._app.use(errorHandler);
  }

  private listen(): void {
    this._server.listen(this._port, () => {
      this._running = true;
      console.log(`Express started on port ${this._port} at context path '${config.server.contextPath}' 🔥`);
    });
  }

  public start(): void {
    this.checkRunning();
    this.route();
    this.listen();
  }

  public shutdown(signal: string, value: number): void {
    this._server.close(() => {
      console.debug(` Trapped signal ${signal}`);
      console.log(`Server is shutting down. Bye 👋`);
      process.exit(128 + value);
    });
  }

  private static notFound(req: Request, res: Response, next: NextFunction): void {
    if (res.status(404)) {
      return next(new NotFoundError(`Cannot ${req.method} ${req.path}`, req));
    }
  }

  private static errorHandler(err: Error | HttpError, req: Request, res: Response, next: NextFunction) {
    if ('status' in err) {
      return res.status(err.status).json(DefaultErrorAttributes.from(err));
    } else {

    }

    const httpError = new InternalServerError(err, req);
    return res.status(httpError.status).json(DefaultErrorAttributes.from(httpError));
  }
}
