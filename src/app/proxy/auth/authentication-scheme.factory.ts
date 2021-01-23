import { AuthenticationScheme } from './authentication-scheme';
import { BasicAuthentication } from './basic-authentication';
import { AuthConfigType } from './proxy-authentication.service';


export class AuthenticationSchemeFactory {

  create(dict: [scheme: string, configs: AuthConfigType]): AuthenticationScheme[] {
    const { 0: scheme, 1: configs } = dict;

    switch (scheme) {
      case 'basic':
        return configs
          .map(config => new BasicAuthentication(config));
      default:
        throw new Error('Authentication scheme could not be determined');
    }
  }
}
