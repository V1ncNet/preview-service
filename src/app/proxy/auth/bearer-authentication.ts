import { OutgoingHttpHeaders } from 'http';
import { AuthenticationScheme } from './authentication-scheme';
import { ResourceLocation } from './proxy-authentication.service';


export interface AccessToken {
  access_token: string;
}

export interface BearerAuthenticationConfiguration extends ResourceLocation, AccessToken { }

export class BearerAuthentication extends AuthenticationScheme {

  constructor(private bearerConfig: BearerAuthenticationConfiguration) {
    super(bearerConfig);
  }

  protected extend(headers: OutgoingHttpHeaders): void {
    headers['Authorization'] = `Basic ${this.bearerConfig.access_token}`;
  }
}
