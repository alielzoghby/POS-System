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
import { Checkbox } from 'primeng/checkbox';

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
    Checkbox,
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
          <label for="voucher_reference" class="block text-sm font-medium mb-1">
            {{ 'voucher.reference' | translate }}
          </label>
          <input
            id="voucher_reference"
            pInputText
            formControlName="voucher_reference"
            class="w-full"
          />
          <app-validation-errors
            [control]="form.get('voucher_reference')"
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

        <!-- Active -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">
            {{ 'voucher.active' | translate }}
          </label>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2">
              <p-radioButton formControlName="active" [value]="true"></p-radioButton>
              {{ 'common.yes' | translate }}
            </label>
            <label class="flex items-center gap-2">
              <p-radioButton formControlName="active" [value]="false"></p-radioButton>
              {{ 'common.no' | translate }}
            </label>
          </div>
        </div>

        <!-- Expired At -->
        <div class="mb-4">
          <label for="expired_at" class="block text-sm font-medium mb-1">
            {{ 'voucher.expiredAt' | translate }}
          </label>
          <input
            id="expired_at"
            type="date"
            formControlName="expired_at"
            class="w-full p-inputtext"
          />
          <app-validation-errors
            [control]="form.get('expired_at')"
            [formGroup]="form"
          ></app-validation-errors>
        </div>

        <!-- Multiple / Customer Discount -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">
            {{ 'voucher.customerDiscount' | translate }}
          </label>
          <div class="flex items-center gap-2">
            <p-checkbox formControlName="multiple" [binary]="true"> </p-checkbox>
            <span>{{ 'voucher.multiple' | translate }}</span>
          </div>
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

    const defaultDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    this.form = this.fb.group({
      voucher_reference: [v?.voucher_reference ?? '', Validators.maxLength(15)],
      type: [v?.percentage ? 'percentage' : 'amount', Validators.required],
      amount: [v?.amount ?? 0, Validators.min(0)],
      percentage: [v?.percentage ?? 0, [Validators.min(0), Validators.max(100)]],
      active: [v?.active ?? true, Validators.required],
      expired_at: [
        this.formatDate(v?.expired_at ? new Date(v.expired_at) : defaultDate),
        Validators.required,
      ],
      multiple: [v?.multiple ?? false],
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // yyyy-MM-dd
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
        voucher_reference: this.form.value.voucher_reference || null,
        amount: this.form.value.type === 'amount' ? this.form.value.amount : null,
        percentage: this.form.value.type === 'percentage' ? this.form.value.percentage : null,
        active: this.form.value.active,
        expired_at: new Date(this.form.value.expired_at),
        multiple: this.form.value.multiple,
      };
      this.dialogRef.close(result);
    }
  }
}
