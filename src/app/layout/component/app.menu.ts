import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { BaseComponent } from '@/shared/component/base-component/base.component';

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

  ngOnInit() {
    this.model = [
      {
        label: this.translate('Home'),
        items: [
          { label: this.translate('Dashboard'), icon: 'pi pi-fw pi-home', routerLink: ['/'] },
        ],
      },
    ];
  }
}
