import { OutgoingHttpHeaders } from 'http';
import { AuthenticationScheme } from './authentication-scheme';
import { BearerAuthenticationConfiguration } from './bearer-authentication-configuration';

export class BearerAuthentication extends AuthenticationScheme {

  constructor(private bearerConfig: BearerAuthenticationConfiguration) {
    super(bearerConfig);
  }

  protected extend(headers: OutgoingHttpHeaders): void {
    headers['Authorization'] = `Basic ${this.bearerConfig.access_token}`;
  }
}
