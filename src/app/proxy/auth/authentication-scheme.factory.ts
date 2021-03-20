import { AuthenticationScheme } from './authentication-scheme';
import { BasicAuthentication } from './basic-authentication';
import { BearerAuthentication } from './bearer-authentication';
import { BearerAuthenticationConfiguration } from './bearer-authentication-configuration';
import { BasicAuthenticationConfiguration } from './basic-authentication-configuration';
import { AuthConfig } from './auth-config';
import { NotImplemented } from '../../../lib/http';

export class AuthenticationSchemeFactory {

  private readonly schemes: Record<string, (configs: AuthConfig) => AuthenticationScheme[]> = { };

  constructor() {
    this.schemes['basic'] = (configs) => (configs as BasicAuthenticationConfiguration[])
      .map(config => new BasicAuthentication(config));
    this.schemes['bearer'] = (configs) => (configs as BearerAuthenticationConfiguration[])
      .map(config => new BearerAuthentication(config));
  }

  from(dict: [scheme: string, configs: AuthConfig]): AuthenticationScheme[] {
    const { 0: scheme, 1: configs } = dict;
    if (0 == configs.length) {
      return [];
    }

    const authenticationSchemes = this.schemes[scheme].call(this, configs);
    if (0 == authenticationSchemes.length) {
      throw new NotImplemented('Authentication scheme is not supported');
    }

    return authenticationSchemes;
  }
}
