import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

import { TranslateModule } from '@ngx-translate/core';
import { ProductModel, ProductStatus } from '../models/product.model';
import { LazyDropdownComponent } from '@/shared/component/lazy-dropdown/lazy-dropdown.component';
import { BaseComponent } from '@/shared/component/base-component/base.component';
import { DatePicker } from 'primeng/datepicker';
import { ValidationErrorsComponent } from '@/shared/component/validation-errors/validation-errors.component';
import { DEFAULT_CURRENCY_CODE } from '@/shared/config/config.constant';
import { FileUpload } from 'primeng/fileupload';
import { Lookup } from '@/shared/enums/lookup.enum';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TranslateModule,
    LazyDropdownComponent,
    DatePicker,
    ValidationErrorsComponent,
    FileUpload,
  ],
  template: `
    <div class="p-4 bg-surface-overlay rounded-xl shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">
          {{
            data.product
              ? ('product.editProduct' | translate)
              : ('product.createProduct' | translate)
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

      <form [formGroup]="form" class="p-fluid" (ngSubmit)="save()">
        <div class="flex flex-col gap-6">
          <div class="field w-full">
            <label for="image" class="block mb-3">{{ 'product.image' | translate }}</label>

            <p-fileUpload
              name="image"
              mode="basic"
              accept="image/*"
              auto="true"
              chooseLabel="{{ 'common.chooseAnImage' | translate }}"
              (onSelect)="onImageSelected($event)"
              [customUpload]="true"
              styleClass="w-full"
            ></p-fileUpload>

            <div *ngIf="previewImage" class="mt-3">
              <img [src]="previewImage" alt="Preview" class="max-h-40 rounded shadow" />
            </div>
          </div>

          <div class="field">
            <label for="name" class="block mb-3">{{ 'product.name' | translate }}</label>
            <input pInputText formControlName="name" id="name" class="w-full" />
            <app-validation-errors [control]="form.get('name')" [formGroup]="form">
            </app-validation-errors>
          </div>

          <div class="field">
            <label for="reference" class="block mb-3">{{ 'product.reference' | translate }}</label>
            <input id="reference" pInputText formControlName="reference" class="w-full" />
            <app-validation-errors [control]="form.get('reference')" [formGroup]="form">
            </app-validation-errors>
          </div>

          <div class="field">
            <label for="lot" class="block mb-3">{{ 'product.lot' | translate }}</label>
            <input id="lot" pInputText formControlName="lot" class="w-full" />
            <app-validation-errors [control]="form.get('lot')" [formGroup]="form">
            </app-validation-errors>
          </div>

          <div class="flex justify-between gap-4 w-full">
            <div class="field">
              <label for="base_price" class="block mb-3">{{
                'product.base_price' | translate
              }}</label>
              <p-inputNumber
                id="base_price"
                formControlName="base_price"
                mode="currency"
                [currency]="DEFAULT_CURRENCY_CODE"
                [min]="0"
                class="w-full"
              ></p-inputNumber>
              <app-validation-errors [control]="form.get('base_price')" [formGroup]="form">
              </app-validation-errors>
            </div>

            <div class="field">
              <label for="final_price" class="block mb-3">{{
                'product.final_price' | translate
              }}</label>
              <p-inputNumber
                id="final_price"
                formControlName="final_price"
                [currency]="DEFAULT_CURRENCY_CODE"
                mode="currency"
                currency="EUR"
                [min]="0"
                class="w-full"
              ></p-inputNumber>
              <app-validation-errors [control]="form.get('final_price')" [formGroup]="form">
              </app-validation-errors>
            </div>
          </div>

          <div class="flex justify-between gap-4">
            <div class="field">
              <label for="quantity" class="block mb-3">{{ 'product.quantity' | translate }}</label>
              <p-inputNumber id="quantity" formControlName="quantity"></p-inputNumber>
              <app-validation-errors [control]="form.get('quantity')" [formGroup]="form">
              </app-validation-errors>
            </div>

            <div class="field w-50">
              <label for="status" class="block mb-3">{{ 'product.status' | translate }}</label>
              <app-lazy-dropdown
                id="status"
                formControlName="status"
                [lookup]="statusOptions"
              ></app-lazy-dropdown>
              <app-validation-errors [control]="form.get('status')" [formGroup]="form">
              </app-validation-errors>
            </div>
          </div>

          <div class="field w-full">
            <label for="category" class="block mb-3">{{ 'product.category' | translate }}</label>
            <app-lazy-dropdown
              id="category"
              formControlName="category_id"
              [lookup]="lookup.Categories"
            ></app-lazy-dropdown>
            <app-validation-errors [control]="form.get('category_id')" [formGroup]="form">
            </app-validation-errors>
          </div>

          <div class="field w-full">
            <label for="expiration_date" class="block  mb-3">{{
              'product.expiration' | translate
            }}</label>
            <p-datepicker
              class="w-full"
              id="expiration_date"
              [showIcon]="true"
              [showButtonBar]="true"
              formControlName="expiration_date"
              dateFormat="dd/mm/yy"
            ></p-datepicker>
            <app-validation-errors [control]="form.get('expiration_date')" [formGroup]="form">
            </app-validation-errors>
          </div>
        </div>

        <div class="mt-8 flex justify-end gap-2">
          <p-button
            type="button"
            label="{{ 'common.cancel' | translate }}"
            severity="secondary"
            (onClick)="cancel()"
          ></p-button>

          <p-button
            type="submit"
            label="{{ 'common.save' | translate }}"
            [disabled]="form.invalid"
          ></p-button>
        </div>
      </form>
    </div>
  `,
})
export class ProductDialogComponent extends BaseComponent {
  protected DEFAULT_CURRENCY_CODE = DEFAULT_CURRENCY_CODE;
  protected lookup = Lookup;
  form: FormGroup;
  statusOptions = Object.values(ProductStatus).map((status) => ({
    label: this.translate(`product.${status}`),
    value: status,
  }));

  previewImage: string | null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product?: ProductModel }
  ) {
    super();
    this.previewImage = this.data?.product?.image || null;
    this.form = this.fb.group({
      image: [data?.product?.image || null], // store Base64 here
      name: [data?.product?.name || '', Validators.required],
      reference: [data?.product?.reference || '', Validators.required],
      lot: [data?.product?.lot || '', Validators.required],
      base_price: [data?.product?.base_price || null, Validators.required],
      final_price: [data?.product?.final_price || null, Validators.required],
      quantity: [data?.product?.quantity || 0, Validators.required],
      status: [data?.product?.status || ProductStatus.InStock, Validators.required],
      category_id: [data?.product?.category_id || null, Validators.required],
      expiration_date: [
        new Date(data?.product?.expiration_date || '') || new Date(),
        Validators.required,
      ],
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  onImageSelected(event: any) {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.previewImage = base64;
        this.form.patchValue({ image: base64 });
      };

      reader.readAsDataURL(file);
    }
  }
}
