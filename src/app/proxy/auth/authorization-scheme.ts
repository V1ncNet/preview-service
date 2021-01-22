import { OutgoingHttpHeaders } from 'http';


export type AuthorizationSchemeType = 'basic';

export abstract class AuthorizationScheme {

  constructor(public scheme: AuthorizationSchemeType) { }

  abstract get hostname(): string;

  abstract get port(): string;

  protected abstract extend(headers: OutgoingHttpHeaders): void;

  create(): OutgoingHttpHeaders {
    const headers: OutgoingHttpHeaders = { };
    this.extend(headers);
    return headers;
  }

  applies(url: URL): boolean {
    return url.hostname === this.hostname && url.port === this.port;
  }
}
