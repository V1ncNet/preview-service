import config from '../../../config.json';
import { proxy } from './proxy.router';


export class CorsUriResolver {

  resolve(documentUri: string): string {
    const contextPath = config.server.contextPath;
    const proxyPath = proxy(documentUri);
    return `${contextPath}${proxyPath}`;
  }
}
