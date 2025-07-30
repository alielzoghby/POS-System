import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { AsyncFeedbackService } from '../services/general/async-feedback.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(AsyncFeedbackService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = '';

      if (error.error?.message) {
        errorMsg = error.error.message;
      }

      messageService.showErrorMessage(errorMsg);

      return throwError(() => error);
    })
  );
};
