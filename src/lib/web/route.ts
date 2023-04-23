export type Route = {
  method: string,
  uri: string,
  middleware: Function[],
  fnName: string,
};
