export type Route = {
  method: string,
  url: string,
  middleware: Function[],
  fnName: string,
};
