import { OutgoingHttpHeaders } from 'http';
import { AuthorizationSchemeFactory } from './authorization-scheme.factory';
import { BasicAuthorizationConfiguration } from './basic-authorization';


export interface ResourceUri {
  hostname: string;
  port: number | string;
}

export type AuthConfigType = BasicAuthorizationConfiguration[];

export interface AuhorizationConfig {
  [scheme: string]: AuthConfigType;
}

export class ProxyAuthorizationService {

  private factory: AuthorizationSchemeFactory = new AuthorizationSchemeFactory();

  constructor(private config: AuhorizationConfig) { }

  authorize(resource: URL): OutgoingHttpHeaders {
    const headers: OutgoingHttpHeaders = Object.entries(this.config)
      .map(dict => this.factory.create(dict))
      .reduce((flat, value) => flat.concat(value), [])
      .filter(scheme => scheme.applies(resource))
      .map(scheme => scheme.create())[0];

    return headers || { };
  }
}
