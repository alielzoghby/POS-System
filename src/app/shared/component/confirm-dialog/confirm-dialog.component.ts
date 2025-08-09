import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

export enum ConfirmDialogSeverity {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  DANGER = 'danger',
  HELP = 'help',
}

export interface ConfirmDialogData {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  severity?: ConfirmDialogSeverity;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, TranslateModule, ButtonModule],
  template: `
    <div class="p-4 bg-surface-overlay rounded-xl shadow-md">
      <div class="flex justify-between items-center mb-2">
        <span class="text-lg font-semibold">
          {{ data.title || ('common.confirmTitle' | translate) }}
        </span>

        <button
          pButton
          type="button"
          icon="pi pi-times"
          class="p-button-rounded p-button-text"
          (click)="onCancel()"
        ></button>
      </div>

      <div class="my-6 ml-4 text-sm">
        <p class="m-0">
          {{ data.message || ('common.confirmMessage' | translate) }}
        </p>
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <button
          pButton
          type="button"
          (click)="onCancel()"
          class="p-button-outlined"
          [label]="data.cancelText || ('common.cancel' | translate)"
        ></button>

        <button
          pButton
          type="button"
          [label]="data.confirmText || ('common.confirm' | translate)"
          [ngClass]="getConfirmButtonClass()"
          (click)="onConfirm()"
        ></button>
      </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  getConfirmButtonClass(): string {
    const severity = this.data.severity || 'primary';
    return `p-button-${severity}`;
  }
}
