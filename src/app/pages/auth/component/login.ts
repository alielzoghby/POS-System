import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { ConfigConstant } from '@/shared/config/config.constant';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '@/shared/component/base-component/base.component';
import { StateSectionComponent } from '@/shared/component/state-section/state-section.component';
import { AuthService } from '@/shared/services/auth/auth.service';
import { RoutesUtil } from '@/shared/utils/routes.util';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { isFieldInvalid } from '@/shared/utils/form-helper.util';
import { ValidationErrorsComponent } from '@/shared/component/validation-errors/validation-errors.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    RippleModule,
    AppFloatingConfigurator,
    TranslateModule,
    StateSectionComponent,
    MessageModule,
    CommonModule,
    ValidationErrorsComponent,
  ],
  template: `
    <app-state-section [state]="sectionState">
      <app-floating-configurator />
      <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden"
      >
        <div class="flex flex-col items-center justify-center">
          <div
            style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)"
          >
            <div
              class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20"
              style="border-radius: 53px"
            >
              <div class="text-center mb-8">
                <img
                  src="assets/img/logo.png"
                  alt="logo"
                  height="50"
                  class="mb-8 w-16 shrink-0 mx-auto"
                />
                <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">
                  {{
                    'WelcomeTo' | translate: { applicationName: ConfigConstant.APPLICATION_NAME }
                  }}
                </div>
                <span class="text-muted-color font-medium">{{
                  'SignInToContinue' | translate
                }}</span>
              </div>

              <form [formGroup]="loginForm" (submit)="onSubmitLogin()">
                <div class="mb-8 flex flex-col gap-2">
                  <label
                    for="email1"
                    class="block text-surface-900 dark:text-surface-0 text-xl font-medium "
                    >{{ 'Email' | translate }}</label
                  >
                  <input
                    pInputText
                    id="email1"
                    type="text"
                    placeholder="{{ 'EmailAddress' | translate }}"
                    class="w-full md:w-120 "
                    formControlName="email"
                  />

                  <app-validation-errors
                    [control]="loginForm.get('email')"
                    [formGroup]="loginForm"
                  ></app-validation-errors>
                </div>

                <div class="mb-8 flex flex-col gap-2">
                  <label
                    for="password"
                    class="block text-surface-900 dark:text-surface-0 text-xl font-medium "
                    >{{ 'Password' | translate }}</label
                  >
                  <p-password
                    id="password1"
                    formControlName="password"
                    placeholder="{{ 'Password' | translate }}"
                    [toggleMask]="true"
                    styleClass="mb-4"
                    [fluid]="true"
                    [feedback]="false"
                  ></p-password>

                  <app-validation-errors
                    [control]="loginForm.get('password')"
                    [formGroup]="loginForm"
                  ></app-validation-errors>
                </div>

                <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                  <div class="flex items-center">
                    <p-checkbox
                      formControlName="rememberMe"
                      id="rememberme1"
                      binary
                      class="mr-2"
                    ></p-checkbox>

                    <label for="rememberme1">{{ 'RememberMe' | translate }}</label>
                  </div>
                  <span
                    class="font-medium no-underline ml-2 text-right cursor-pointer text-primary"
                    >{{ 'ForgotPassword' | translate }}</span
                  >
                </div>
                <p-button
                  label="{{ 'SignIn' | translate }}"
                  styleClass="w-full"
                  type="submit"
                  [disabled]="loginForm.invalid"
                ></p-button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </app-state-section>
  `,
})
export class LoginComponent extends BaseComponent implements OnInit {
  protected readonly ConfigConstant = ConfigConstant;
  protected readonly isFieldInvalid = isFieldInvalid;

  loginForm!: FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  onSubmitLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    this.load(this.authService.login({ email, password }), {
      isLoadingTransparent: true,
    }).subscribe(() => {
      this.router.navigate([RoutesUtil.Dashboard.url()]);
    });
  }
}
