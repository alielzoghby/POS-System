import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { AsyncFeedbackService } from '../services/general/async-feedback.service'; // adjust path if needed

export const successInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(AsyncFeedbackService);

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse && event.status === 200) {
        const msg = (event.body as { message?: string })?.message;

        if (msg) {
          messageService.showSuccessMessage(msg);
        }
      }
    })
  );
};
