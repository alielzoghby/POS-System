import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AsyncFeedbackService {
  constructor(private service: MessageService) {}

  showInfoMessage(message: string) {
    this.service.add({ severity: 'info', summary: 'Info Message', detail: 'PrimeNG rocks' });
  }

  showWarnMessage(message: string) {
    this.service.add({
      severity: 'warn',
      summary: 'Warn Message',
      detail: 'There are unsaved changes',
    });
  }

  showErrorMessage(message: string) {
    this.service.add({ severity: 'error', summary: 'Error Message', detail: 'Validation failed' });
  }

  showSuccessMessage(message: string) {
    this.service.add({ severity: 'success', summary: 'Success Message', detail: 'Message sent' });
  }
}
