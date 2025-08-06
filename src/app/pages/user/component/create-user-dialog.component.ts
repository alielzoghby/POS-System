import { UserService } from '../service/user.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { Password } from 'primeng/password';
import { ValidationErrorsComponent } from '@/shared/component/validation-errors/validation-errors.component';
import { isFieldInvalid, passwordsMatchValidator } from '@/shared/utils/form-helper.util';
import { BaseComponent } from '@/shared/component/base-component/base.component';
import { StateSectionComponent } from '@/shared/component/state-section/state-section.component';
import { first } from 'rxjs';

@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    TranslateModule,
    Password,
    ValidationErrorsComponent,
    StateSectionComponent,
  ],
  template: `
    <app-state-section [state]="sectionState">
      <div class="p-6 w-full max-w-md bg-surface-overlay rounded-xl shadow-md">
        <h2 class="text-2xl font-bold text-primary mb-6">
          {{ 'user.create' | translate }}
        </h2>

        <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
          <div class="flex flex-col gap-2">
            <label for="email" class="font-medium text-sm">
              {{ 'profile.email' | translate }}
            </label>
            <input pInputText id="email" formControlName="email" class="w-full" />
            <app-validation-errors [control]="form.get('email')"></app-validation-errors>
          </div>

          <div class="flex flex-col gap-2">
            <label for="firstName" class="font-medium text-sm">
              {{ 'profile.firstName' | translate }}
            </label>
            <input pInputText id="firstName" formControlName="first_name" class="w-full" />
            <app-validation-errors [control]="form.get('first_name')"></app-validation-errors>
          </div>

          <div class="flex flex-col gap-2">
            <label for="lastName" class="font-medium text-sm">
              {{ 'profile.lastName' | translate }}
            </label>
            <input pInputText id="lastName" formControlName="last_name" class="w-full" />
            <app-validation-errors [control]="form.get('last_name')"></app-validation-errors>
          </div>

          <div class="flex flex-col gap-2">
            <label for="password" class="font-medium text-sm">
              {{ 'profile.password' | translate }}
            </label>
            <p-password
              id="password"
              formControlName="password"
              [toggleMask]="true"
              [fluid]="true"
              [feedback]="false"
            ></p-password>
            <app-validation-errors [control]="form.get('password')"></app-validation-errors>
          </div>

          <div class="flex flex-col gap-2">
            <label for="confirmPassword" class="font-medium text-sm">
              {{ 'profile.confirmPassword' | translate }}
            </label>
            <p-password
              id="confirmPassword"
              formControlName="confirmPassword"
              [toggleMask]="true"
              [fluid]="true"
              [feedback]="false"
            ></p-password>
            <app-validation-errors [control]="form.get('confirmPassword')" [formGroup]="form">
            </app-validation-errors>
          </div>

          <div class="pt-4 flex justify-end gap-3">
            <button
              pButton
              type="button"
              class="p-button-outlined"
              (click)="cancel()"
              [label]="'common.cancel' | translate"
            ></button>
            <button
              pButton
              type="submit"
              [disabled]="form.invalid"
              [label]="'common.save' | translate"
            ></button>
          </div>
        </form>
      </div>
    </app-state-section>
  `,
})
export class CreateUserDialogComponent extends BaseComponent {
  form: FormGroup;
  protected readonly isFieldInvalid = isFieldInvalid;

  constructor(
    private dialogRef: MatDialogRef<CreateUserDialogComponent>,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    super();
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordsMatchValidator }
    );
  }

  save(): void {
    if (this.form.invalid) return;

    const { confirmPassword, ...user } = this.form.value;

    this.load(this.userService.addUser(user), { isLoadingTransparent: true }).subscribe(() => {
      this.dialogRef.close(this.form.value);
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
