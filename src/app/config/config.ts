import { InjectionToken } from '@angular/core';
export class AppConfig {
  apiEndpoint: string;
  clientId: string;
  resource: string;
  tenantId: string;
  redirectUri: string;
}
export let APP_CONFIG = new InjectionToken<AppConfig>('app.config')
const Config = {
  url : 'http://localhost:80/api',
   // AAD CREDENTIAL
  clientID : 'a7be96cc-f8a3-41c5-9d6a-abb1394eed2c',
  tenantID: 'db7ac9ef-779d-46e5-9bca-00509580ad6b',
  webClientId: '8e607ac3-805d-4b05-9316-4247ef5944fc'
};
export {Config};
