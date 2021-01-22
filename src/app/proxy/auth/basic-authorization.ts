import { OutgoingHttpHeaders } from 'http';
import { AuthorizationScheme } from './authorization-scheme';
import { ResourceUri } from './proxy-authorization.service';
import { btoa } from '../../../utils';


export interface UserPass {
  username?: string;
  password?: string;
  basic_credentials?: string;
}

export interface BasicAuthorizationConfiguration extends ResourceUri, UserPass { }

export class BasicAuthorization extends AuthorizationScheme {

  private _hostname: string;
  private _port: number | string;

  constructor(private config: BasicAuthorizationConfiguration) {
    super('basic');
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
    const { basic_credentials, username, password } = this.config;

    let basicAuth: string;
    if (basic_credentials) {
      basicAuth = `Basic ${basic_credentials}`;
    } else if (username && password) {
      const credentials = `${username}:${password}`;
      basicAuth = `Basic ${btoa(credentials)}`;
    } else {
      throw new Error('Config\'s credentials could not be determined');
    }

    headers['Authorization'] = basicAuth;
  }
}
