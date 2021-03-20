import { AuthenticationScheme } from './authentication-scheme';
import { BasicAuthentication, BasicAuthenticationConfiguration } from './basic-authentication';
import { BearerAuthentication, BearerAuthenticationConfiguration } from './bearer-authentication';
import { AuthConfigType } from './proxy-authentication.service';
import { NotImplemented } from '../../../lib/http';

export class AuthenticationSchemeFactory {

  private readonly schemes: Record<string, (configs: AuthConfigType) => AuthenticationScheme[]> = { };

  constructor() {
    this.schemes['basic'] = (configs) => (configs as BasicAuthenticationConfiguration[])
      .map(config => new BasicAuthentication(config));
    this.schemes['bearer'] = (configs) => (configs as BearerAuthenticationConfiguration[])
      .map(config => new BearerAuthentication(config));
  }

  from(dict: [scheme: string, configs: AuthConfigType]): AuthenticationScheme[] {
    const { 0: scheme, 1: configs } = dict;
    const authenticationSchemes = this.schemes[scheme].call(this, configs) || [];
    if (0 == authenticationSchemes.length) {
      throw new NotImplemented('Authentication scheme is not supported');
    }

    return authenticationSchemes;
  }
}
