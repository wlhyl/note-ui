import { InjectionToken } from '@angular/core';

export interface EnvConfig {
  baseUrl: string;
}

export const ENV_CONFIG = new InjectionToken<EnvConfig>('ENV_CONFIG');

export const envConfig: EnvConfig = {
  baseUrl: 'http://127.0.0.1:8080',
};
