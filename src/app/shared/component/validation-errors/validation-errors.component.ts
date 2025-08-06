import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-validation-errors',
  standalone: true,
  imports: [CommonModule, TranslateModule, MessageModule],
  template: `
    <!-- Field-level errors -->
    <ng-container *ngIf="control && control.errors && (control.touched || control.dirty)">
      <p-message
        *ngIf="control.errors['required']"
        severity="error"
        [text]="'formErrors.required' | translate"
      ></p-message>

      <p-message
        *ngIf="control.errors['email']"
        severity="error"
        [text]="'formErrors.email' | translate"
      ></p-message>

      <p-message
        *ngIf="control.errors['minlength']"
        severity="error"
        [text]="
          'formErrors.minlength'
            | translate: { requiredLength: control.errors['minlength'].requiredLength }
        "
      ></p-message>

      <p-message
        *ngIf="control.errors['mismatch']"
        severity="error"
        [text]="'formErrors.passwordMismatch' | translate"
      ></p-message>
    </ng-container>

    <!-- Form-level errors -->
    <ng-container *ngIf="formGroup && formGroup.errors && (formGroup.touched || formGroup.dirty)">
      <p-message
        *ngIf="formGroup.errors['passwordMismatch']"
        severity="error"
        [text]="'formErrors.passwordMismatch' | translate"
      ></p-message>
    </ng-container>
  `,
})
export class ValidationErrorsComponent {
  @Input() control!: AbstractControl | null;
  @Input() formGroup?: FormGroup;
}
