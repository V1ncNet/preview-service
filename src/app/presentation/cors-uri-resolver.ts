import config from '../../config.json';
import ProxyController from './proxy.controller';


export class CorsUriResolver {

  resolve(documentUri: string): string {
    const contextPath = config.server.contextPath;
    const proxyPath = ProxyController.proxy(documentUri);
    return `${contextPath}${proxyPath}`;
  }
}
