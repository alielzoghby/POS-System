import { HttpInterceptorFn } from '@angular/common/http';
import { StorageConstant } from '../config/storage.constant';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageData = localStorage.getItem(StorageConstant.AUTH_USER)
    ? JSON.parse(localStorage.getItem(StorageConstant.AUTH_USER) || '{}')
    : null;

  let headers = req.headers;

  if (localStorageData) {
    const { token, language } = localStorageData;

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    if (language) {
      headers = headers.set('Accept-Language', language);
    }
  }

  req = req.clone({ headers, withCredentials: true });

  return next(req);
};
