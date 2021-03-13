export default (args: (string | Function)[]): [string, Function[]] => {
  const hasPath = typeof args[0] === 'string';
  const path = hasPath ? args[0] : '';
  const middleware = hasPath ? args.slice(1) : args;

  if (middleware.some(m => typeof m !== 'function')) {
    throw new Error('Middleware must be function');
  }

  return [path as string, middleware as Function[]];
};
