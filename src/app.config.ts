import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, DEFAULT_CURRENCY_CODE, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
} from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from './translate-loader';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { StorageConstant } from '@/shared/config/storage.constant';
import { MessageService } from 'primeng/api';
import { authInterceptor } from '@/shared/interceptors/token.interceptor';
import { errorInterceptor } from '@/shared/interceptors/error.interceptor';
import { successInterceptor } from '@/shared/interceptors/success.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    MessageService,
    JwtHelperService,
    provideHttpClient(withInterceptors([authInterceptor, successInterceptor, errorInterceptor])),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
      JwtModule.forRoot({
        config: {
          tokenGetter: () => localStorage.getItem(StorageConstant.AUTH_USER),
        },
      })
    ),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      withEnabledBlockingInitialNavigation()
    ),
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
  ],
};
