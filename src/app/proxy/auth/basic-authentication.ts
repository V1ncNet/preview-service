import { OutgoingHttpHeaders } from 'http';
import { AuthenticationScheme } from './authentication-scheme';
import { btoa } from '../../../lib/utils';
import { InternalServerError } from '../../../lib/http';
import { BasicAuthenticationConfiguration } from './basic-authentication-configuration';

export class BasicAuthentication extends AuthenticationScheme {

  constructor(private basicAuthConfig: BasicAuthenticationConfiguration) {
    super(basicAuthConfig);
  }

  protected extend(headers: OutgoingHttpHeaders): void {
    const { basic_credentials, username, password } = this.basicAuthConfig;

    let basicAuth: string;
    if (basic_credentials) {
      basicAuth = `Basic ${basic_credentials}`;
    } else if (username && password) {
      const credentials = `${username}:${password}`;
      basicAuth = `Basic ${btoa(credentials)}`;
    } else {
      // TODO: Evaluate on startup
      throw new InternalServerError(`Config doesn't supply authentication details for ${this.hostname}:${this.port}`);
    }

    headers['Authorization'] = basicAuth;
  }
}
