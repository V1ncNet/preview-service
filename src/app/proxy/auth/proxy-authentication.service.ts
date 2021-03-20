import { OutgoingHttpHeaders } from 'http';
import { AuthenticationSchemeFactory } from './authentication-scheme.factory';
import { AuthConfig } from './auth-config';

export class ProxyAuthenticationService {

  private factory: AuthenticationSchemeFactory = new AuthenticationSchemeFactory();

  constructor(private config: Record<string, AuthConfig>) { }

  authenticate(resource: URL): OutgoingHttpHeaders {
    const headers: OutgoingHttpHeaders = Object.entries(this.config)
      .map(dict => this.factory.from(dict))
      .reduce((flat, value) => flat.concat(value), [])
      .filter(scheme => scheme.applies(resource))
      .map(scheme => scheme.create())[0];

    return headers || { };
  }
}
