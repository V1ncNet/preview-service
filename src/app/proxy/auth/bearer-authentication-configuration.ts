import { ResourceLocation } from './resource-location';

export interface BearerAuthenticationConfiguration extends ResourceLocation {
  access_token: string;
}
