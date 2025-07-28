import { Component, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { BaseComponent } from '@/shared/component/base-component/base.component';
import { Button } from 'primeng/button';
import { Popover, PopoverModule } from 'primeng/popover';
import { TranslateModule } from '@ngx-translate/core';
import { Badge } from 'primeng/badge';
import { OverlayBadge } from 'primeng/overlaybadge';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, RouterModule, Popover, TranslateModule, OverlayBadge],
  template: `
    <button
      type="button"
      label="Show"
      class="layout-topbar-action"
      (click)="toggleNotification(notification, $event)"
    >
      <p-overlaybadge
        [badgeDisabled]="!unreadCount"
        badgeSize="small"
        [value]="unreadCount"
        severity="danger"
      >
        <i class="pi pi-bell"></i>
        <span>{{ 'Notifications' | translate }}</span>
      </p-overlaybadge>
    </button>

    <p-popover #notification id="overlay_panel" appendTo="body" [style]="{ width: '450px' }">
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <div class="font-semibold text-xl">{{ 'Notifications' | translate }}</div>
        </div>

        <span class="block text-muted-color font-medium mb-4">TODAY</span>
        <ul class="p-0 mx-0 mt-0 mb-6 list-none">
          <li class="flex items-center py-2 border-b border-surface">
            <div
              class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0"
            >
              <i class="pi pi-dollar text-xl! text-blue-500"></i>
            </div>
            <span class="text-surface-900 dark:text-surface-0 leading-normal"
              >Richard Jones
              <span class="text-surface-700 dark:text-surface-100"
                >has purchased a blue t-shirt for
                <span class="text-primary font-bold">$79.00</span></span
              >
            </span>
          </li>
          <li class="flex items-center py-2">
            <div
              class="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full mr-4 shrink-0"
            >
              <i class="pi pi-download text-xl! text-orange-500"></i>
            </div>
            <span class="text-surface-700 dark:text-surface-100 leading-normal"
              >Your request for withdrawal of
              <span class="text-primary font-bold">$2500.00</span> has been initiated.</span
            >
          </li>
        </ul>

        <span class="block text-muted-color font-medium mb-4">YESTERDAY</span>
        <ul class="p-0 m-0 list-none mb-6">
          <li class="flex items-center py-2 border-b border-surface">
            <div
              class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0"
            >
              <i class="pi pi-dollar text-xl! text-blue-500"></i>
            </div>
            <span class="text-surface-900 dark:text-surface-0 leading-normal"
              >Keyser Wick
              <span class="text-surface-700 dark:text-surface-100"
                >has purchased a black jacket for
                <span class="text-primary font-bold">$59.00</span></span
              >
            </span>
          </li>
          <li class="flex items-center py-2 border-b border-surface">
            <div
              class="w-12 h-12 flex items-center justify-center bg-pink-100 dark:bg-pink-400/10 rounded-full mr-4 shrink-0"
            >
              <i class="pi pi-question text-xl! text-pink-500"></i>
            </div>
            <span class="text-surface-900 dark:text-surface-0 leading-normal"
              >Jane Davis
              <span class="text-surface-700 dark:text-surface-100"
                >has posted a new questions about your product.</span
              >
            </span>
          </li>
        </ul>
        <span class="block text-muted-color font-medium mb-4">LAST WEEK</span>
        <ul class="p-0 m-0 list-none">
          <li class="flex items-center py-2 border-b border-surface">
            <div
              class="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-full mr-4 shrink-0"
            >
              <i class="pi pi-arrow-up text-xl! text-green-500"></i>
            </div>
            <span class="text-surface-900 dark:text-surface-0 leading-normal"
              >Your revenue has increased by <span class="text-primary font-bold">%25</span>.</span
            >
          </li>
          <li class="flex items-center py-2 border-b border-surface">
            <div
              class="w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-full mr-4 shrink-0"
            >
              <i class="pi pi-heart text-xl! text-purple-500"></i>
            </div>
            <span class="text-surface-900 dark:text-surface-0 leading-normal"
              ><span class="text-primary font-bold">12</span> users have added your products to
              their wishlist.</span
            >
          </li>
        </ul>
      </div>
    </p-popover>
  `,
})
export class NotificationComponent extends BaseComponent {
  @ViewChild('notification') notification!: any;

  unreadCount = 6;

  @HostListener('window:scroll')
  onScroll() {
    this.notification?.alignOverlay?.();
  }
  toggleNotification(op: Popover, event: any) {
    op.toggle(event);
  }
}
