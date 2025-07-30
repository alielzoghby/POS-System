import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AsyncFeedbackService {
  constructor(private service: MessageService) {}

  showInfoMessage(message: string, summary: string = 'Info Message') {
    this.service.add({ severity: 'info', summary, detail: message });
  }

  showWarnMessage(message: string, summary: string = 'Warn Message') {
    this.service.add({
      severity: 'warn',
      summary,
      detail: message,
    });
  }

  showErrorMessage(message: string, summary: string = 'Error Message') {
    this.service.add({ severity: 'error', summary, detail: message });
  }

  showSuccessMessage(message: string, summary: string = 'Success Message') {
    this.service.add({ severity: 'success', summary, detail: message });
  }
}
