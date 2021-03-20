import { Proxy } from './proxy';
import { HttpProxy } from './http-proxy';
import http from 'http';
import https from 'https';
import { NotImplemented } from '../../lib/http';
import { FileProxy } from './file-proxy';

export class ProxyFactory {

  private readonly proxies: Record<string, () => Proxy> = { };

  constructor() {
    this.proxies['http:'] = () => new HttpProxy(http.get);
    this.proxies['https:'] = () => new HttpProxy(https.get);
    this.proxies['file:'] = () => new FileProxy();
  }

  create(url: URL): Proxy {
    const protocol = url.protocol;
    const proxy = this.proxies[protocol].call(this);
    if (!proxy) {
      throw new NotImplemented(`Protocol ${protocol} is not supported`);
    }

    return proxy;
  }
}
