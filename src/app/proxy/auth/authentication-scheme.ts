import { OutgoingHttpHeaders } from 'http';


export type AuthenticationSchemeType = 'basic';

export abstract class AuthenticationScheme {

  constructor(public scheme: AuthenticationSchemeType) { }

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
