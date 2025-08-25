import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TranslateModule } from '@ngx-translate/core';
import { ValidationErrorsComponent } from '@/shared/component/validation-errors/validation-errors.component';
import { Voucher } from '../models/voucher.model';

export type VoucherDialogData = {
  mode: 'create' | 'edit';
  voucher?: Voucher;
};

@Component({
  selector: 'app-voucher-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    TranslateModule,
    ValidationErrorsComponent,
  ],
  template: `
    <div class="p-4 bg-surface-overlay rounded-xl shadow-md">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">
          {{
            data.mode === 'create'
              ? ('voucher.createTitle' | translate)
              : ('voucher.editTitle' | translate)
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

      <!-- Form -->
      <form [formGroup]="form" (ngSubmit)="submit()">
        <!-- Reference -->
        <div class="mb-4">
          <label for="voucher_refrence" class="block text-sm font-medium mb-1">
            {{ 'voucher.reference' | translate }}
          </label>
          <input
            id="voucher_refrence"
            pInputText
            formControlName="voucher_refrence"
            class="w-full"
          />
          <app-validation-errors
            [control]="form.get('voucher_refrence')"
            [formGroup]="form"
          ></app-validation-errors>
        </div>

        <!-- Select Type -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">{{ 'voucher.type' | translate }}</label>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2">
              <p-radioButton
                formControlName="type"
                value="amount"
                (onClick)="onTypeChange()"
              ></p-radioButton>
              {{ 'voucher.amount' | translate }}
            </label>

            <label class="flex items-center gap-2">
              <p-radioButton
                formControlName="type"
                value="percentage"
                (onClick)="onTypeChange()"
              ></p-radioButton>
              {{ 'voucher.percentage' | translate }}
            </label>
          </div>
        </div>

        <!-- Amount -->
        <div class="mb-4">
          <label for="amount" class="block text-sm font-medium mb-1">{{
            'voucher.amount' | translate
          }}</label>
          <p-inputNumber
            id="amount"
            formControlName="amount"
            [disabled]="this.form.value.type !== 'amount'"
            [min]="0"
            [showButtons]="true"
            mode="currency"
            currency="USD"
            class="w-full"
          ></p-inputNumber>
          <app-validation-errors
            [control]="form.get('amount')"
            [formGroup]="form"
          ></app-validation-errors>
        </div>

        <!-- Percentage -->
        <div class="mb-4">
          <label for="percentage" class="block text-sm font-medium mb-1">{{
            'voucher.percentage' | translate
          }}</label>
          <p-inputNumber
            id="percentage"
            formControlName="percentage"
            [disabled]="this.form.value.type !== 'percentage'"
            [min]="0"
            [max]="100"
            [showButtons]="true"
            mode="decimal"
            class="w-full"
          ></p-inputNumber>
          <app-validation-errors
            [control]="form.get('percentage')"
            [formGroup]="form"
          ></app-validation-errors>
        </div>

        <!-- Actions -->
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
export class VoucherDialogComponent implements OnInit {
  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<VoucherDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VoucherDialogData,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const v = this.data.voucher;

    this.form = this.fb.group({
      voucher_refrence: [v?.voucher_refrence ?? ''],
      type: [v?.amount ? 'amount' : 'percentage', Validators.required],
      amount: [v?.amount ?? 0, Validators.min(0)],
      percentage: [v?.percentage ?? 0, [Validators.min(0), Validators.max(100)]],
    });
  }

  onTypeChange() {
    if (this.form.value.type === 'amount') {
      this.form.get('amount')?.enable();
      this.form.get('percentage')?.disable();
      this.form.get('percentage')?.setValue(0);
    } else {
      this.form.get('percentage')?.enable();
      this.form.get('amount')?.disable();
      this.form.get('amount')?.setValue(0);
    }
  }

  submit(): void {
    if (this.form.valid) {
      const result: Voucher = {
        ...this.data.voucher,
        voucher_refrence: this.form.value.voucher_refrence || null,
        amount: this.form.value.type === 'amount' ? this.form.value.amount : null,
        percentage: this.form.value.type === 'percentage' ? this.form.value.percentage : null,
      };
      this.dialogRef.close(result);
    }
  }
}
