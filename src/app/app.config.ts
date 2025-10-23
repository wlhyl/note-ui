import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthenticationInfoService } from './services/authentication/authentication-info.service';
import { ApiService } from './services/api/api.service';
import { ConfigService } from './services/config/config.service';
import { appInit } from './services/init/app-init';
import { ENV_CONFIG,envConfig } from './tokens/app-config.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    {
      provide: ENV_CONFIG,
      useValue: envConfig,
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideAppInitializer(() => {
      const initializerFn = (
        (
          user: AuthenticationInfoService,
          api: ApiService,
          config: ConfigService
        ) =>
        () =>
          appInit(user, api, config)
      )(
        inject(AuthenticationInfoService),
        inject(ApiService),
        inject(ConfigService)
      );
      return initializerFn();
    }),
  ]
};
