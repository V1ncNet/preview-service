import { proxy } from './proxy.router';

export class CorsUriResolver {

  resolve(documentUri: string): string {
    const proxyPath = proxy(documentUri);
    return `${proxyPath}`;
  }
}
