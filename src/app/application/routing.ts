const PREFIX = '$$route_';

function destruct(args: (string | Function)[]): [string, Function[]] {
  const hasPath = typeof args[0] === 'string';
  const path = hasPath ? args[0] : '';
  const middleware = hasPath ? args.slice(1) : args;

  if (middleware.some(m => typeof m !== 'function')) {
    throw new Error('Middleware must be function');
  }

  return [path as string, middleware as Function[]];
}

export function route(method: string, ...args: (string | Function)[]): Function {
  const [path, middleware] = destruct(args);

  return function (target: any, name: string) {
    target[`${PREFIX}${name}`] = { method, path, middleware };
  };
}

const methods = ['head', 'options', 'get', 'post', 'put', 'patch', 'del', 'delete', 'all'];
methods.forEach(method => exports[method] = route.bind(null, method));

export function controller(...args: (string | Function)[]) {
  const [ctrlPath, ctrlMiddleware] = destruct(args);

  return function (target: any) {
    const proto = target.prototype;
    proto.$routes = Object.getOwnPropertyNames(proto)
      .filter(prop => prop.indexOf(PREFIX) === 0)
      .map(prop => {
        const { method, path, middleware: actionMiddleware } = proto[prop];
        const url = `${ctrlPath}${path}`;
        const middleware = ctrlMiddleware.concat(actionMiddleware);
        const fnName = prop.substring(PREFIX.length);
        return { method: method === 'del' ? 'delete' : method, url, middleware, fnName };
      });
  };
}
