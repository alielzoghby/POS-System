import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageConstant } from '../config/storage.constant';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const localStorageData = localStorage.getItem(StorageConstant.AUTH_USER)
      ? JSON.parse(localStorage.getItem(StorageConstant.AUTH_USER) || '')
      : '';

    if (localStorageData) {
      const { token, language } = localStorageData;
      let headers = request.headers;

      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }

      headers = headers.set('Accept-Language', language);

      const modifiedReq = request.clone({ headers });

      return next.handle(modifiedReq);
    }
    return next.handle(request);
  }
}
