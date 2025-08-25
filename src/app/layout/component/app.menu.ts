import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { BaseComponent } from '@/shared/component/base-component/base.component';
import { RoutesUtil } from '@/shared/utils/routes.util';
import { UserRoleService } from '@/shared/services/auth/user-role.service';
import { RolesConstants } from '@/shared/config/roles-constants';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `<ul class="layout-menu">
    <ng-container *ngFor="let item of model; let i = index">
      <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
      <li *ngIf="item.separator" class="menu-separator"></li>
    </ng-container>
  </ul> `,
})
export class AppMenu extends BaseComponent {
  model: MenuItem[] = [];

  constructor(private userRoleService: UserRoleService) {
    super();
  }

  ngOnInit() {
    this.model = [
      {
        label: this.translate('Dashboard'),
        icon: 'pi pi-fw pi-home',
        routerLink: [RoutesUtil.Dashboard.url()],
      },
      {
        label: this.translate('Users'),
        icon: 'pi pi-fw pi-users',
        routerLink: [RoutesUtil.UserList.url()],
        visible: this.userRoleService.isUserHasRoles(RolesConstants.ADD_EDIT_USER),
      },
      {
        label: this.translate('Category'),
        icon: 'pi pi-fw pi-tags',
        routerLink: [RoutesUtil.CategoryList.url()],
      },
      {
        label: this.translate('Products'),
        icon: 'pi pi-fw pi-box',
        routerLink: [RoutesUtil.ProductList.url()],
      },
      {
        label: this.translate('Configuration'),
        icon: 'pi pi-fw pi-cog',
        routerLink: [RoutesUtil.Configuration.url()],
        visible: this.userRoleService.isUserHasRoles(RolesConstants.EDIT_CONFIGURATION),
      },
      {
        label: this.translate('Vouchers'),
        icon: 'pi pi-fw pi-ticket',
        routerLink: [RoutesUtil.Voucher.url()],
      },
    ];
  }
}
