import { OutgoingHttpHeaders } from 'http';
import { AuthenticationSchemeFactory } from './authentication-scheme.factory';
import { BasicAuthenticationConfiguration } from './basic-authentication';
import { BearerAuthenticationConfiguration } from './bearer-authentication';


export interface ResourceUri {
  hostname: string;
  port: number | string;
}

export type AuthConfigType = BasicAuthenticationConfiguration[] | BearerAuthenticationConfiguration[];

export interface AuthenticationConfig {
  [scheme: string]: AuthConfigType;
}

export class ProxyAuthenticationService {

  private factory: AuthenticationSchemeFactory = new AuthenticationSchemeFactory();

  constructor(private config: AuthenticationConfig) { }

  authenticate(resource: URL): OutgoingHttpHeaders {
    const headers: OutgoingHttpHeaders = Object.entries(this.config)
      .map(dict => this.factory.create(dict))
      .reduce((flat, value) => flat.concat(value), [])
      .filter(scheme => scheme.applies(resource))
      .map(scheme => scheme.create())[0];

    return headers || { };
  }
}
