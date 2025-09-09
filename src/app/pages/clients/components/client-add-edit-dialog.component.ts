import { Component, Inject, OnInit } from '@angular/core';
import {
  FormArray,
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
import { CheckboxModule } from 'primeng/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { ValidationErrorsComponent } from '@/shared/component/validation-errors/validation-errors.component';
import { Client } from '../models/client.model';
import { Country, State, City } from 'country-state-city';
import { NgxIntlTelInputModule, CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { SelectModule } from 'primeng/select';
import { MapToDropdownPipe } from '@/shared/pipes/map-to-dropdown-pipe';
import { BaseComponent } from '@/shared/component/base-component/base.component';
import { LazyDropdownComponent } from '@/shared/component/lazy-dropdown/lazy-dropdown.component';
import { PhoneType } from '../enum/phone-type.enum';

export type ClientDialogData = {
  mode: 'create' | 'edit';
  client?: Client;
};

@Component({
  selector: 'app-client-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    CheckboxModule,
    TranslateModule,
    ValidationErrorsComponent,
    NgxIntlTelInputModule,
    SelectModule,
    MapToDropdownPipe,
    LazyDropdownComponent,
  ],
  template: `
    <div class="p-4 bg-surface-overlay rounded-xl shadow-md max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-primary">
          {{ data.mode === 'create' ? ('client.create' | translate) : ('client.edit' | translate) }}
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
        <!-- First Name / Last Name -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium mb-1">
              {{ 'client.first_name' | translate }}
            </label>
            <input pInputText formControlName="first_name" class="w-full" />
            <app-validation-errors [control]="form.get('first_name')"></app-validation-errors>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">
              {{ 'client.last_name' | translate }}
            </label>
            <input pInputText formControlName="last_name" class="w-full" />
            <app-validation-errors [control]="form.get('last_name')"></app-validation-errors>
          </div>
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">{{ 'client.email' | translate }}</label>
          <input pInputText type="email" formControlName="email" class="w-full" />
          <app-validation-errors [control]="form.get('email')"></app-validation-errors>
        </div>

        <!-- Company & Sales -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium mb-1">{{ 'client.company' | translate }}</label>
            <input pInputText formControlName="company" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">{{ 'client.sales' | translate }}</label>
            <p-inputNumber
              formControlName="sales"
              [min]="0"
              [showButtons]="true"
              class="w-full"
            ></p-inputNumber>
          </div>
        </div>

        <!-- Active -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">{{ 'client.active' | translate }}</label>
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

        <!-- Addresses -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-medium">{{ 'client.addresses' | translate }}</h3>
            <button
              pButton
              icon="pi pi-plus"
              class="p-button-sm"
              type="button"
              (click)="addAddress()"
            ></button>
          </div>
          <div formArrayName="addresses" class="space-y-4">
            <div
              *ngFor="let address of addresses.controls; let i = index"
              [formGroupName]="i"
              class="p-3 border rounded-md bg-gray-50"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <input pInputText placeholder="Street" formControlName="street" />

                <p-select
                  [options]="countriesDropdown"
                  formControlName="country"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select Country"
                  appendTo="body"
                  (onChange)="onCountryChange(i)"
                  filter="true"
                ></p-select>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <p-select
                  [options]="address.get('statesList')?.value | mapToDropdown"
                  formControlName="state"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select State"
                  (onChange)="onStateChange(i)"
                  appendTo="body"
                  filter="true"
                ></p-select>

                <p-select
                  [options]="address.get('citiesList')?.value | mapToDropdown"
                  formControlName="city"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select City"
                  appendTo="body"
                  filter="true"
                ></p-select>

                <input pInputText placeholder="Postal Code" formControlName="postal_code" />
              </div>
              <div class="flex items-center justify-between mt-2">
                <label class="flex items-center gap-2">
                  <p-checkbox formControlName="is_primary" [binary]="true"></p-checkbox>
                  {{ 'client.primaryAddress' | translate }}
                </label>
                <button
                  pButton
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-text p-button-danger"
                  type="button"
                  (click)="removeAddress(i)"
                ></button>
              </div>
            </div>
          </div>
        </div>

        <!-- Phone Numbers -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-medium">{{ 'client.phoneNumbers' | translate }}</h3>
            <button
              pButton
              icon="pi pi-plus"
              class="p-button-sm"
              type="button"
              (click)="addPhoneNumber()"
            ></button>
          </div>
          <div formArrayName="phoneNumbers" class="space-y-4">
            <div
              *ngFor="let phone of phoneNumbers.controls; let i = index"
              [formGroupName]="i"
              class="p-3 border rounded-md bg-gray-50"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <ngx-intl-tel-input
                  [cssClass]="'w-100'"
                  [preferredCountries]="[CountryISO.France]"
                  [enableAutoCountrySelect]="true"
                  [enablePlaceholder]="true"
                  [searchCountryFlag]="true"
                  [searchCountryField]="[SearchCountryField.All]"
                  [selectFirstCountry]="true"
                  [maxLength]="15"
                  formControlName="phone"
                ></ngx-intl-tel-input>

                <div>
                  <app-lazy-dropdown
                    id="unit"
                    formControlName="phone_type"
                    [lookup]="phoneTypeOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Type"
                    class="w-100"
                  ></app-lazy-dropdown>
                </div>
              </div>
              <div class="flex items-center justify-between mt-2">
                <label class="flex items-center gap-2">
                  <p-checkbox formControlName="is_primary" [binary]="true"></p-checkbox>
                  {{ 'client.primaryPhone' | translate }}
                </label>
                <button
                  pButton
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-text p-button-danger"
                  type="button"
                  (click)="removePhoneNumber(i)"
                ></button>
              </div>
            </div>
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
export class ClientDialogComponent extends BaseComponent implements OnInit {
  form!: FormGroup;

  countries = Country.getAllCountries();

  public CountryISO = CountryISO;
  public SearchCountryField = SearchCountryField;

  countriesDropdown = this.countries.map((c) => ({ label: c.name, value: c.isoCode }));

  phoneTypeOptions = Object.values(PhoneType).map((type) => ({
    label: this.translate(`client.phoneTypes.${type}`),
    value: type,
  }));

  get addresses(): FormArray {
    return this.form.get('addresses') as FormArray;
  }

  get phoneNumbers(): FormArray {
    return this.form.get('phoneNumbers') as FormArray;
  }

  constructor(
    public dialogRef: MatDialogRef<ClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClientDialogData,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    const c = this.data.client;

    this.form = this.fb.group({
      first_name: [c?.first_name ?? '', [Validators.required, Validators.maxLength(30)]],
      last_name: [c?.last_name ?? '', [Validators.required, Validators.maxLength(30)]],
      email: [c?.email ?? '', [Validators.required, Validators.email, Validators.maxLength(100)]],
      company: [c?.company ?? '', Validators.maxLength(50)],
      sales: [c?.sales ?? 0, Validators.min(0)],
      active: [c?.active ?? true, Validators.required],
      addresses: this.fb.array(
        c?.addresses?.map((a) => this.buildAddress(a)) ?? [this.buildAddress()]
      ),
      phoneNumbers: this.fb.array(
        c?.phoneNumbers?.map((p) => this.buildPhoneNumber(p)) ?? [this.buildPhoneNumber()]
      ),
    });
  }

  buildAddress(address?: any): FormGroup {
    const countryObj = this.countries.find((c) => c.name === address?.country);
    const countryCode = countryObj?.isoCode ?? address?.country ?? '';

    const states = State.getStatesOfCountry(countryCode) || [];
    const stateObj = states.find((s) => s.name === address?.state);
    const stateCode = stateObj?.isoCode ?? address?.state ?? '';

    const cities = City.getCitiesOfState(countryCode, stateCode) || [];
    const cityObj = cities.find((c) => c.name === address?.city);
    const cityValue = cityObj?.name ?? address?.city ?? '';

    return this.fb.group({
      street: [address?.street ?? '', Validators.required],
      country: [countryCode, Validators.required],
      state: [stateCode, Validators.required],
      city: [cityValue, Validators.required],
      postal_code: [address?.postal_code ?? ''],
      is_primary: [address?.is_primary ?? false],
      statesList: [states],
      citiesList: [cities],
    });
  }

  buildPhoneNumber(phone?: any): FormGroup {
    return this.fb.group({
      phone: [phone?.phone_number ?? '', Validators.required],
      phone_type: [phone?.phone_type ?? ''],
      is_primary: [phone?.is_primary ?? false],
    });
  }

  addAddress() {
    this.addresses.push(this.buildAddress());
  }

  removeAddress(index: number) {
    if (this.addresses.length > 1) this.addresses.removeAt(index);
  }

  addPhoneNumber() {
    this.phoneNumbers.push(this.buildPhoneNumber());
  }

  removePhoneNumber(index: number) {
    if (this.phoneNumbers.length > 1) this.phoneNumbers.removeAt(index);
  }

  onCountryChange(index: number) {
    const address = this.addresses.at(index);
    const countryCode = address.get('country')?.value;
    address.patchValue({ state: '', city: '' });
    address.get('statesList')?.setValue(State.getStatesOfCountry(countryCode) || []);
    address.get('citiesList')?.setValue([]);
  }

  onStateChange(index: number) {
    const address = this.addresses.at(index);
    const countryCode = address.get('country')?.value;
    const stateCode = address.get('state')?.value;
    address.patchValue({ city: '' });
    address.get('citiesList')?.setValue(City.getCitiesOfState(countryCode, stateCode) || []);
  }

  submit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;

      const addresses = (formValue.addresses || []).map((a: any) => {
        const countryObj = this.countries.find((c) => c.isoCode === a.country);
        const stateObj = a.statesList?.find((s: any) => s.isoCode === a.state);
        const cityObj = a.citiesList?.find((c: any) => c.name === a.city);

        return {
          street: a.street,
          country: countryObj?.name || a.country,
          state: stateObj?.name || a.state,
          city: cityObj?.name || a.city,
          postal_code: a.postal_code,
          is_primary: a.is_primary,
        };
      });

      const phoneNumbers = (formValue.phoneNumbers || []).map((p: any) => ({
        phone_number: p.phone?.internationalNumber || p.phone,
        phone_type: p.phone_type,
        is_primary: p.is_primary,
      }));

      this.dialogRef.close({
        ...this.data.client,
        ...formValue,
        addresses,
        phoneNumbers,
      });
    }
  }
}
