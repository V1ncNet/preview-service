import { AuthorizationScheme } from './authorization-scheme';
import { BasicAuthorization } from './basic-authorization';
import { AuthConfigType } from './proxy-authorization.service';


export class AuthorizationSchemeFactory {

  create(dict: [scheme: string, configs: AuthConfigType]): AuthorizationScheme[] {
    const { 0: scheme, 1: configs } = dict;

    switch (scheme) {
      case 'basic':
        return configs
          .map(config => new BasicAuthorization(config));
      default:
        throw new Error('Authorization scheme could not be determined');
    }
  }
}
