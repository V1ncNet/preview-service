import { BasicAuthenticationConfiguration } from './basic-authentication-configuration';
import { BearerAuthenticationConfiguration } from './bearer-authentication-configuration';

export type AuthConfig = BasicAuthenticationConfiguration[] | BearerAuthenticationConfiguration[];
