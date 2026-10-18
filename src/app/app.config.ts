import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay, withNoIncrementalHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { AuthenticationInfoService } from './services/authentication/authentication-info.service';
import { ApiService } from './services/api/api.service';
import { ConfigService } from './services/config/config.service';
import { SsrDataService } from './services/ssr/ssr-data.service';
import { appInit } from './services/init/app-init';
import { ENV_CONFIG,envConfig } from './tokens/app-config.token';
import { KATEX_OPTIONS, provideMarkdown } from 'ngx-markdown';

export const appConfig: ApplicationConfig = {
  providers: [
    provideMarkdown({
      // output: 'html' 避免 MathML 标签被 Angular 消毒器剔除导致公式显示异常
      katexOptions: { provide: KATEX_OPTIONS, useValue: { throwOnError: false, output: 'html' } },
    }),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(withEventReplay(), withNoIncrementalHydration()),
    {
      provide: ENV_CONFIG,
      useValue: envConfig,
    },
    provideHttpClient(withInterceptorsFromDi(),withFetch()),
    provideAppInitializer(() => {
      const initializerFn = (
        (
          user: AuthenticationInfoService,
          api: ApiService,
          config: ConfigService,
          ssrDataService: SsrDataService
        ) =>
        () =>
          appInit(user, api, config, ssrDataService)
      )(
        inject(AuthenticationInfoService),
        inject(ApiService),
        inject(ConfigService),
        inject(SsrDataService)
      );
      return initializerFn();
    }),
  ]
};
