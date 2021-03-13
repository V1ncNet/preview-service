import destruct from '../destruct';
import { PREFIX } from '../index';

export const route = (method: string, ...args: (string | Function)[]): Function => {
  const [path, middleware] = destruct(args);

  return function (target: any, name: string) {
    target[`${PREFIX}${name}`] = { method, path, middleware };
  };
};

const methods = ['head', 'options', 'get', 'post', 'put', 'patch', 'del', 'delete', 'all'];
methods.forEach(method => exports[method] = route.bind(null, method));
