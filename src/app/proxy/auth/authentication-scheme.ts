import { OutgoingHttpHeaders } from 'http';
import { ResourceLocation } from './proxy-authentication.service';

export abstract class AuthenticationScheme {

  protected constructor(private config: ResourceLocation) { }

  protected get hostname(): string {
    return this.config.hostname;
  };

  protected get port(): string {
    return String(this.config.port || '-1');
  };

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
