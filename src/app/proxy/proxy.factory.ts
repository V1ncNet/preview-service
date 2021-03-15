import { Proxy } from './proxy';
import { HttpProxy } from './http-proxy';
import http from 'http';
import https from 'https';
import { NotImplemented } from '../../lib/http';

export class ProxyFactory {

  create(url: URL): Proxy {
    const protocol = url.protocol;
    switch (protocol) {
      case 'http:':
        return new HttpProxy(http.get);
      case 'https:':
        return new HttpProxy(https.get);
      default:
        throw new NotImplemented(`Protocol ${protocol} is not supported`);
    }
  }
}
