import { HttpInterceptorFn } from '@angular/common/http';
import { StorageConstant } from '../config/storage.constant';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageData = localStorage.getItem(StorageConstant.AUTH_USER)
    ? JSON.parse(localStorage.getItem(StorageConstant.AUTH_USER) || '')
    : null;

  if (localStorageData) {
    const { token, language } = localStorageData;
    let headers = req.headers;

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    if (language) {
      headers = headers.set('Accept-Language', language);
    }

    req = req.clone({ headers });
  }

  return next(req);
};
