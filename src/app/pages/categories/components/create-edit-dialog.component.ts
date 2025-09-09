import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import { ValidationErrorsComponent } from '@/shared/component/validation-errors/validation-errors.component';
import { CategoryModel } from '../model/category.model';

export type CategoryDialogData = {
  mode: 'create' | 'edit';
  category?: CategoryModel;
};

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TranslateModule,
    ValidationErrorsComponent,
  ],
  template: `
    <div class="p-4 bg-surface-overlay rounded-xl shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-primary">
          {{
            data.mode === 'create' ? ('category.create' | translate) : ('category.edit' | translate)
          }}
        </h2>
        <button
          pButton
          icon="pi pi-times"
          class="p-button-rounded p-button-text p-button-sm"
          (click)="dialogRef.close()"
          type="button"
          aria-label="Close"
        ></button>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium mb-1">
            {{ 'category.name' | translate }}
          </label>
          <input id="name" pInputText formControlName="name" class="w-full" />
          <app-validation-errors
            [control]="form.get('name')"
            [formGroup]="form"
          ></app-validation-errors>
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <button
            pButton
            type="button"
            label="{{ 'common.cancel' | translate }}"
            class="p-button-text"
            (click)="dialogRef.close()"
          ></button>
          <button
            pButton
            type="submit"
            [label]="
              data.mode === 'create' ? ('common.create' | translate) : ('common.save' | translate)
            "
            [disabled]="form.invalid"
          ></button>
        </div>
      </form>
    </div>
  `,
})
export class CategoryDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryDialogData,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: [data.category?.name ?? '', Validators.required],
    });
  }

  submit(): void {
    if (this.form.valid) {
      const updatedCategory = {
        ...this.data.category,
        name: this.form.value.name,
      };
      this.dialogRef.close(updatedCategory);
    }
  }
}
