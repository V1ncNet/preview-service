import destruct from '../destruct';
import { PREFIX } from '../index';

export const controller = (...args: (string | Function)[]) => {
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
};
