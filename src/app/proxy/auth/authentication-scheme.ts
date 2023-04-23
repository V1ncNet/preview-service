import { OutgoingHttpHeaders } from 'http';
import { ResourceLocation } from './resource-location';

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

  applies(uri: URL): boolean {
    return this.testHostname(uri) && this.testPort(uri);
  }

  protected testHostname(uri: URL) {
    return uri.hostname === this.hostname;
  }

  protected testPort(uri: URL) {
    const { protocol } = uri;

    if ((protocol === 'http:' || protocol === 'https:') && this.port === '-1') {
      return true;
    } else if (protocol === 'http:' && this.port === '80') {
      return true;
    } else if (protocol === 'https:' && this.port === '443') {
      return true;
    }

    return uri.port === this.port;
  }

  protected abstract extend(headers: OutgoingHttpHeaders): void;
}
