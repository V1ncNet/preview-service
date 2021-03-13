import { OutgoingHttpHeaders } from 'http';
import { AuthenticationScheme } from './authentication-scheme';
import { ResourceUri } from './proxy-authentication.service';


export interface AccessToken {
  access_token: string;
}

export interface BearerAuthenticationConfiguration extends ResourceUri, AccessToken { }

export class BearerAuthentication extends AuthenticationScheme {

  private readonly _hostname: string;
  private readonly _port: number | string;

  constructor(private config: BearerAuthenticationConfiguration) {
    super();
    this._hostname = config.hostname;
    this._port = config.port;
  }

  get hostname(): string {
    return this._hostname;
  }

  get port(): string {
    return String(this._port);
  }

  protected extend(headers: OutgoingHttpHeaders): void {
    headers['Authorization'] = `Basic ${this.config.access_token}`;
  }
}
