import { ResourceLocation } from './resource-location';

export interface BasicAuthenticationConfiguration extends ResourceLocation {
  username?: string;
  password?: string;
  basic_credentials?: string;
}
