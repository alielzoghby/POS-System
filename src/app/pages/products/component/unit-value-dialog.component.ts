import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { ValidationErrorsComponent } from '@/shared/component/validation-errors/validation-errors.component';
import { BaseComponent } from '@/shared/component/base-component/base.component';
import { StateSectionComponent } from '@/shared/component/state-section/state-section.component';
import { isFieldInvalid } from '@/shared/utils/form-helper.util';
import { ProductModel } from '../models/product.model';

@Component({
  selector: 'app-unit-value-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputNumberModule,
    ButtonModule,
    TranslateModule,
    ValidationErrorsComponent,
    StateSectionComponent,
  ],
  template: `
    <app-state-section [state]="sectionState">
      <div class="p-6 w-full max-w-md bg-surface-overlay rounded-xl shadow-md">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-primary">
            {{ 'product.setUnitValue' | translate }}
          </h2>
          <button
            pButton
            icon="pi pi-times"
            class="p-button-rounded p-button-text p-button-sm"
            (click)="cancel()"
            type="button"
            aria-label="Close"
          ></button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
          <!-- Unit Value -->
          <div class="flex flex-col gap-2">
            <label for="unit_value" class="font-medium text-sm">
              {{ 'product.unitValue' | translate }}
            </label>
            <p-inputNumber
              inputId="unit_value"
              formControlName="unit_value"
              class="w-full"
              [min]="0"
              mode="decimal"
              [minFractionDigits]="2"
              [maxFractionDigits]="5"
              [useGrouping]="false"
            ></p-inputNumber>
            <app-validation-errors [control]="form.get('unit_value')"></app-validation-errors>
          </div>

          <!-- Original Unit Value -->
          <div class="flex flex-col gap-2">
            <label for="original_unit_value" class="font-medium text-sm">
              {{ 'product.ProductUnitValue' | translate }}
            </label>
            <div class="flex items-center gap-2">
              <p-inputNumber
                inputId="original_unit_value"
                formControlName="original_unit_value"
                class="w-full"
                [min]="0"
                [useGrouping]="false"
                [disabled]="true"
              ></p-inputNumber>

              <span>X</span>
              <span>{{ data.quantity || 0 }}</span>
              <span>{{ 'product.quantity' | translate }}</span>
            </div>
          </div>

          <!-- Actions -->
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
export class UnitValueDialogComponent extends BaseComponent {
  form: FormGroup;
  protected readonly isFieldInvalid = isFieldInvalid;

  constructor(
    private dialogRef: MatDialogRef<UnitValueDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ProductModel
  ) {
    super();

    this.form = this.fb.group({
      unit_value: [null, [Validators.required, Validators.min(0)]],
      original_unit_value: [{ value: data.unit_value || '', disabled: true }],
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
