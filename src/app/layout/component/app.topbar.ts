import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { ChangeLanguageButtonComponent } from '@/shared/component/change-language-button/change-language-button.component';
import { ConfigConstant } from '@/shared/config/config.constant';
import { AuthService } from '@/shared/services/auth/auth.service';
import { JwtDecoderService } from '@/shared/services/auth/jwt-decoder.service';
import { RoutesUtil } from '@/shared/utils/routes.util';
import { SplitButton } from 'primeng/splitbutton';
import { BaseComponent } from '@/shared/component/base-component/base.component';
import { NotificationComponent } from './app.notification';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    StyleClassModule,
    AppConfigurator,
    ChangeLanguageButtonComponent,
    SplitButton,
    NotificationComponent,
  ],
  template: ` <div class="layout-topbar">
    <div class="layout-topbar-logo-container">
      <button
        class="layout-menu-button layout-topbar-action"
        (click)="layoutService.onMenuToggle()"
      >
        <i class="pi pi-bars"></i>
      </button>
      <a class="layout-topbar-logo" routerLink="/">
        <img src="/assets/img/logo.png" alt="logo" />
        <span class="text-nowrap">{{ ConfigConstant.APPLICATION_NAME }}</span>
      </a>
    </div>

    <div class="layout-topbar-actions">
      <div class="layout-config-menu">
        <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
          <i
            [ngClass]="{
              'pi ': true,
              'pi-moon': layoutService.isDarkTheme(),
              'pi-sun': !layoutService.isDarkTheme(),
            }"
          ></i>
        </button>
        <div class="relative">
          <button
            class="layout-topbar-action layout-topbar-action-highlight"
            pStyleClass="@next"
            enterFromClass="hidden"
            enterActiveClass="animate-scalein"
            leaveToClass="hidden"
            leaveActiveClass="animate-fadeout"
            [hideOnOutsideClick]="true"
          >
            <i class="pi pi-palette"></i>
          </button>
          <app-configurator />
        </div>
      </div>

      <button
        class="layout-topbar-menu-button layout-topbar-action"
        pStyleClass="@next"
        enterFromClass="hidden"
        enterActiveClass="animate-scalein"
        leaveToClass="hidden"
        leaveActiveClass="animate-fadeout"
        [hideOnOutsideClick]="true"
      >
        <i class="pi pi-ellipsis-v"></i>
      </button>

      <div class="layout-topbar-menu hidden lg:block">
        <div class="layout-topbar-menu-content">
          <!-- <button type="button" class="layout-topbar-action">
            <i class="pi pi-calendar"></i>
            <span>Calendar</span>
          </button> -->

          <app-notification></app-notification>
          <p-splitButton
            [label]="currentUser?.userName"
            (onClick)="currentUser && goToUserProfile()"
            [model]="items"
            icon="pi pi-fw pi-user"
            class="layout-topbar-splitButton"
            [rounded]="true"
            text
            severity="secondary"
          />

          <app-change-language-button></app-change-language-button>
        </div>
      </div>
    </div>
  </div>`,
})
export class AppTopbar extends BaseComponent {
  items!: MenuItem[];
  currentUser!: any;

  protected readonly ConfigConstant = ConfigConstant;

  constructor(
    public layoutService: LayoutService,
    private authService: AuthService,
    private jwtDecoderService: JwtDecoderService,
    private router: Router
  ) {
    super();
    this.currentUser = this.authService.currentUser$.value.user;
    this.generateMenuItems();
  }

  generateMenuItems() {
    this.items = [
      {
        label: this.translate('logout'),
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout();
        },
      },
    ];
  }

  logout() {
    this.jwtDecoderService.removeCurrentToken();
    this.router.navigate([RoutesUtil.AuthLogin.url()]);
  }

  goToUserProfile() {
    this.router.navigate([RoutesUtil.UserProfile.url({ params: { id: this.currentUser._id } })]);
  }
  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }
}
