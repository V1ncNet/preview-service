import { AuthenticationScheme } from './authentication-scheme';
import { BasicAuthentication, BasicAuthenticationConfiguration } from './basic-authentication';
import { BearerAuthentication, BearerAuthenticationConfiguration } from './bearer-authentication';
import { AuthConfigType } from './proxy-authentication.service';
import { NotImplemented } from '../../../lib/http';

export class AuthenticationSchemeFactory {

  create(dict: [scheme: string, configs: AuthConfigType]): AuthenticationScheme[] {
    const { 0: scheme, 1: configs } = dict;

    switch (scheme) {
      case 'basic':
        return (configs as BasicAuthenticationConfiguration[])
          .map(config => new BasicAuthentication(config));
      case 'bearer':
        return (configs as BearerAuthenticationConfiguration[])
          .map(config => new BearerAuthentication(config));
      default:
        // TODO: Evaluate on startup
        throw new NotImplemented('Authentication scheme is not supported');
    }
  }
}
