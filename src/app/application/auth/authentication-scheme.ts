import { OutgoingHttpHeaders } from 'http';


export abstract class AuthenticationScheme {

  abstract get hostname(): string;

  abstract get port(): string;

  create(): OutgoingHttpHeaders {
    const headers: OutgoingHttpHeaders = { };
    this.extend(headers);
    return headers;
  }

  applies(url: URL): boolean {
    return url.hostname === this.hostname && url.port === this.port;
  }

  protected abstract extend(headers: OutgoingHttpHeaders): void;
}
