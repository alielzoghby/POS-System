import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';

import { TranslateModule } from '@ngx-translate/core';
import { ProductModel, ProductStatus } from '../models/product.model';
import { LazyDropdownComponent } from '@/shared/component/lazy-dropdown/lazy-dropdown.component';
import { BaseComponent } from '@/shared/component/base-component/base.component';
import { DatePicker } from 'primeng/datepicker';
import { ValidationErrorsComponent } from '@/shared/component/validation-errors/validation-errors.component';
import { DEFAULT_CURRENCY_CODE } from '@/shared/config/config.constant';
import { FileUpload } from 'primeng/fileupload';
import { Lookup } from '@/shared/enums/lookup.enum';
import { ProductUnit } from '../enums/product-unit.enum';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    TranslateModule,
    LazyDropdownComponent,
    DatePicker,
    ValidationErrorsComponent,
    FileUpload,
    AccordionModule,
  ],
  template: `
    <div class="p-6 bg-surface-overlay rounded-2xl shadow-lg max-h-screen overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6 border-b pb-3">
        <h2 class="text-2xl font-semibold">
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

      <!-- Form -->
      <form [formGroup]="form" class="p-fluid" (ngSubmit)="save()">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Show Online Checkbox -->
          <div class="field col-span-2 flex items-center gap-2">
            <p-checkbox formControlName="show_online" [binary]="true"></p-checkbox>
            <label>{{ 'product.showOnline' | translate }}</label>
          </div>

          <!-- Image Upload -->
          <div class="field col-span-2">
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
              <img [src]="previewImage" alt="Preview" class="max-h-48 rounded shadow" />
            </div>
          </div>

          <!-- Name -->
          <div class="field col-span-2">
            <label for="name">{{ 'product.name' | translate }}</label>
            <input pInputText formControlName="name" id="name" class="w-full" />
            <app-validation-errors
              [control]="form.get('name')"
              [formGroup]="form"
            ></app-validation-errors>
          </div>

          <!-- Reference -->
          <div class="field col-span-2 md:col-span-1">
            <label for="reference">{{ 'product.reference' | translate }}</label>
            <input id="reference" pInputText formControlName="reference" class="w-full" />
            <app-validation-errors
              [control]="form.get('reference')"
              [formGroup]="form"
            ></app-validation-errors>
          </div>

          <!-- Lot -->
          <div class="field col-span-2 md:col-span-1">
            <label for="lot">{{ 'product.lot' | translate }}</label>
            <input id="lot" pInputText formControlName="lot" class="w-full" />
            <app-validation-errors
              [control]="form.get('lot')"
              [formGroup]="form"
            ></app-validation-errors>
          </div>

          <!-- Prices -->
          <div class="field col-span-2 md:col-span-1">
            <label for="base_price">{{ 'product.base_price' | translate }}</label>
            <p-inputNumber
              id="base_price"
              formControlName="base_price"
              mode="currency"
              [currency]="DEFAULT_CURRENCY_CODE"
              [min]="0"
              class="w-full"
            ></p-inputNumber>
            <app-validation-errors
              [control]="form.get('base_price')"
              [formGroup]="form"
            ></app-validation-errors>
          </div>

          <div class="field col-span-2 md:col-span-1">
            <label for="final_price">{{ 'product.final_price' | translate }}</label>
            <p-inputNumber
              id="final_price"
              formControlName="final_price"
              [currency]="DEFAULT_CURRENCY_CODE"
              mode="currency"
              [min]="0"
              class="w-full"
            ></p-inputNumber>
            <app-validation-errors
              [control]="form.get('final_price')"
              [formGroup]="form"
            ></app-validation-errors>
          </div>

          <!-- Quantity + Status -->
          <div class="field col-span-2 md:col-span-1">
            <label for="quantity">{{ 'product.quantity' | translate }}</label>
            <p-inputNumber id="quantity" formControlName="quantity" class="w-full"></p-inputNumber>
            <app-validation-errors
              [control]="form.get('quantity')"
              [formGroup]="form"
            ></app-validation-errors>
          </div>

          <div class="field col-span-2 md:col-span-1">
            <label for="status">{{ 'product.status' | translate }}</label>
            <app-lazy-dropdown
              id="status"
              formControlName="status"
              [lookup]="statusOptions"
            ></app-lazy-dropdown>
            <app-validation-errors
              [control]="form.get('status')"
              [formGroup]="form"
            ></app-validation-errors>
          </div>

          <!-- Category -->
          <div class="field col-span-2">
            <label for="category">{{ 'product.category' | translate }}</label>
            <app-lazy-dropdown
              id="category"
              formControlName="category_id"
              [lookup]="lookup.Categories"
            ></app-lazy-dropdown>
            <app-validation-errors
              [control]="form.get('category_id')"
              [formGroup]="form"
            ></app-validation-errors>
          </div>

          <!-- Expiration -->
          <div class="field col-span-2">
            <label for="expiration_date">{{ 'product.expiration' | translate }}</label>
            <p-datepicker
              class="w-full"
              id="expiration_date"
              [showIcon]="true"
              [showButtonBar]="true"
              formControlName="expiration_date"
              dateFormat="dd/mm/yy"
            ></p-datepicker>
            <app-validation-errors
              [control]="form.get('expiration_date')"
              [formGroup]="form"
            ></app-validation-errors>
          </div>
        </div>

        <p-accordion [value]="0">
          <p-accordion-panel
            [value]="1"
            class="mt-4 text-black p-4 border rounded-lg bg-surface-100 w-full"
          >
            <p-accordion-header>{{
              'product.showUnitConfigurationSection' | translate
            }}</p-accordion-header>
            <p-accordion-content>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="field col-span-3 md:col-span-1">
                  <label for="unit">{{ 'product.unit' | translate }}</label>
                  <app-lazy-dropdown
                    id="unit"
                    formControlName="unit"
                    [lookup]="unitOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="{{ 'product.selectUnit' | translate }}"
                    class="w-100"
                  ></app-lazy-dropdown>
                </div>

                <div class="field col-span-3 md:col-span-1">
                  <label for="unit_value">{{ 'product.unitValue' | translate }}</label>
                  <p-inputNumber
                    id="unit_value"
                    formControlName="unit_value"
                    [min]="0"
                  ></p-inputNumber>
                </div>

                <div class="field col-span-3 md:col-span-1">
                  <label for="unit_price">{{ 'product.unitPrice' | translate }}</label>
                  <p-inputNumber
                    id="unit_price"
                    formControlName="unit_price"
                    mode="currency"
                    [currency]="DEFAULT_CURRENCY_CODE"
                    [min]="0"
                    class="w-full"
                  ></p-inputNumber>
                </div>
              </div>
            </p-accordion-content>
          </p-accordion-panel>
        </p-accordion>

        <!-- Buttons -->
        <div class="mt-8 flex justify-end gap-3">
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

  unitOptions = Object.values(ProductUnit).map((unit) => ({
    label: this.translate(`product.${unit}`),
    value: unit,
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
      reference: [data?.product?.reference || '', [Validators.required, Validators.maxLength(15)]],
      lot: [data?.product?.lot || '', Validators.required],
      base_price: [data?.product?.base_price || null, Validators.required],
      final_price: [data?.product?.final_price || null, Validators.required],
      quantity: [data?.product?.quantity || 0, Validators.required],
      status: [data?.product?.status || ProductStatus.InStock, Validators.required],
      category_id: [data?.product?.category_id || null, Validators.required],
      expiration_date: [
        new Date(data?.product?.expiration_date || new Date()),
        Validators.required,
      ],

      show_online: [data?.product?.show_online ?? true],
      unit: [data?.product?.unit ?? ProductUnit.PIECE],
      unit_value: [data?.product?.unit_value ?? null],
      unit_price: [data?.product?.unit_price ?? null],
    });

    this.form.get('final_price')?.valueChanges.subscribe((price) => {
      this.form.patchValue({ unit_price: price });
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
