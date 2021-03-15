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
    return this.testHostname(url) && this.testPort(url);
  }

  protected testHostname(url: URL) {
    return url.hostname === this.hostname;
  }

  protected testPort(url: URL) {
    const { protocol } = url;

    if ((protocol === 'http:' || protocol === 'https:') && this.port === '-1') {
      return true;
    } else if (protocol === 'http:' && this.port === '80') {
      return true;
    } else if (protocol === 'https:' && this.port === '443') {
      return true;
    }

    return url.port === this.port;
  }

  protected abstract extend(headers: OutgoingHttpHeaders): void;
}
