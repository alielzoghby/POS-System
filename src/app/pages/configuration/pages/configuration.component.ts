import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ConfigurationService } from '../service/configuration-service';
import { Configuration } from '../model/configuration.model';
import { BaseComponent } from '@/shared/component/base-component/base.component';
import { ValidationErrorsComponent } from '@/shared/component/validation-errors/validation-errors.component';
import { StateSectionComponent } from '@/shared/component/state-section/state-section.component';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ValidationErrorsComponent,
    StateSectionComponent,
  ],
  template: `
    <app-state-section [state]="sectionState">
      <div class="p-6 bg-surface-overlay rounded-xl shadow-md w-full">
        <div class="mb-4">
          <h2 class="text-xl font-semibold text-primary">
            {{ 'configuration.title' | translate }}
          </h2>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSave()" class="row g-3">
          <div class="col-md-6">
            <label for="tax" class="form-label fw-bold">
              {{ 'configuration.tax' | translate }} (%)
            </label>

            <!-- Normal view -->
            <div *ngIf="!editMode" class="d-flex align-items-center">
              <span class="me-3">{{ form.get('tax')?.value }}</span>
              <button
                pButton
                type="button"
                (click)="editMode = true"
                icon="pi pi-pencil"
                label="{{ 'common.edit' | translate }}"
                class="p-button-sm p-button-text"
              ></button>
            </div>

            <!-- Edit mode -->
            <div *ngIf="editMode">
              <input
                pInputText
                id="tax"
                type="number"
                formControlName="tax"
                class="form-control"
                placeholder="{{ 'configuration.enterTax' | translate }}"
              />

              <app-validation-errors [control]="form.get('tax')" [formGroup]="form">
              </app-validation-errors>

              <div class="mt-2 d-flex gap-2">
                <button
                  pButton
                  type="submit"
                  icon="pi pi-save"
                  label="{{ 'common.save' | translate }}"
                  class="p-button-success"
                  [disabled]="form.invalid"
                ></button>
                <button
                  pButton
                  type="button"
                  icon="pi pi-times"
                  label="{{ 'common.cancel' | translate }}"
                  class="p-button-secondary"
                  (click)="cancelEdit()"
                ></button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </app-state-section>
  `,
})
export class ConfigurationComponent extends BaseComponent implements OnInit {
  form!: FormGroup;
  editMode = false;

  constructor(
    private fb: FormBuilder,
    private configService: ConfigurationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      tax: [null, [Validators.required, Validators.min(0)]],
    });
    this.loadConfiguration();
  }

  loadConfiguration() {
    this.load(this.configService.getConfiguration()).subscribe((config: Configuration) => {
      this.form.patchValue(config);
    });
  }

  onSave() {
    if (this.form.invalid) return;

    this.load(this.configService.updateConfiguration(this.form.value)).subscribe(
      (config: Configuration) => {
        this.form.patchValue(config);
        this.editMode = false; // back to normal mode
      }
    );
  }

  cancelEdit() {
    this.editMode = false;
    this.loadConfiguration(); // reset to original value
  }
}
