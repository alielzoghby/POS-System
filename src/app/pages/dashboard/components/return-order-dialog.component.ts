import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '@/shared/component/base-component/base.component';
import { ProductModel } from '@/pages/products/models/product.model';
import { Order, OrderList } from '@/pages/orders/models/order.model';
import { PosProductListTableComponent } from './pos-product-list-table.component';
import { Popover } from 'primeng/popover';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { OrderService } from '@/pages/orders/services/order.service';
import { Chip } from 'primeng/chip';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-return-order-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    TranslateModule,
    PosProductListTableComponent,
    Popover,
    Chip,
    Tag,
  ],
  template: `
    <div class="p-4 bg-surface-overlay rounded-xl shadow-md w-full max-h-screen overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-primary">
          {{ 'POS.RETURN_ORDER' | translate }}
        </h2>
        <button
          pButton
          icon="pi pi-times"
          class="p-button-rounded p-button-text p-button-sm"
          (click)="cancel()"
          type="button"
          aria-label="Close"
        ></button>
      </div>

      <!-- Search Input -->
      <div class="flex gap-2 mb-4 relative" *ngIf="!data?.order">
        <input
          type="text"
          pInputText
          class="flex-1 p-3 border-2 rounded-lg h-[60px] "
          placeholder="{{ 'POS.ENTER_ORDER_BARCODE' | translate }}"
          [(ngModel)]="barcode"
          (input)="onSearchInput($event, pop)"
          (keydown)="onKeyDown($event, pop)"
          cdkFocusInitial
        />
        <button
          pButton
          type="button"
          label="{{ 'POS.SEARCH' | translate }}"
          icon="pi pi-search"
          class="p-button-primary h-[60px] "
          (click)="onSearchInput(barcode, pop)"
        ></button>

        <!-- Order Search Popover -->
        <p-popover #pop>
          <div *ngIf="searchData?.length; else noResults">
            <ul class="list-none m-0 p-0">
              <li
                *ngFor="let o of searchData; let i = index"
                (click)="selectOrder(o, pop)"
                [class.bg-blue-200]="i === selectedIndex"
                class="p-2 hover:bg-gray-100 cursor-pointer"
              >
                <span class="font-medium text-nowrap">
                  {{ o.reference }} - {{ o.total_price | currency }} -
                  <p-tag
                    [value]="'orders.' + o.paid_status | translate"
                    [severity]="o.paid_status === 'PAID' ? 'success' : 'Warning'"
                  ></p-tag>
                  -
                  {{ o.created_at | date: 'short' }}
                </span>
              </li>
            </ul>
          </div>
          <ng-template #noResults>
            <div class="p-2 text-gray-500">{{ 'No orders found' }}</div>
          </ng-template>
        </p-popover>
      </div>

      <!-- Content: Two columns -->
      <div class="flex gap-6" *ngIf="!isExpired; else expiredTemplate">
        <!-- LEFT: Table -->
        <div class="flex-1 max-h-[500px] overflow-auto">
          <app-pos-product-list-table
            [products]="products"
            (removeProduct)="removeProduct($event)"
            (updateTotal)="recalculate()"
          ></app-pos-product-list-table>
        </div>

        <!-- RIGHT: Order Details -->
        <div class="w-[400px] flex flex-col gap-4 border-l pl-4 text-xl ">
          <div>
            <div class="flex justify-between items-center">
              <h3 class="font-semibold text-lg mb-2">{{ 'POS.ORDER_DETAILS' | translate }}</h3>

              <div
                class="flex items-center gap-2"
                *ngIf="order?.payment_method || order?.payment_reference"
              >
                <p-chip
                  *ngIf="order?.payment_method"
                  [label]="'POS.' + order?.payment_method | translate"
                  class="w-auto"
                />
                <p-chip
                  *ngIf="order?.payment_reference"
                  [label]="('POS.CARD_REFERENCE' | translate) + ':' + order?.payment_reference"
                />
              </div>
            </div>
            <div>
              {{ 'POS.ORDER_ID' | translate }}:
              <span class="font-medium"> {{ order?.order_id }}</span>
            </div>
            <div>
              {{ 'POS.REFERENCE' | translate }}:
              <span class="font-medium">{{ order?.reference }}</span>
            </div>
            <div *ngIf="order?.client">
              {{ 'POS.CLIENT' | translate }}:
              <span class="font-medium"
                >{{ order?.client?.first_name }}
                {{ order?.client?.last_name }}
              </span>
            </div>
            <div>
              {{ 'POS.DATE' | translate }}:
              <span class="font-medium">
                {{ order?.created_at | date: 'short' }}
                <span *ngIf="order?.creator" class="ml-2 font-semibold"
                  >(
                  {{ order?.creator?.first_name + ' ' + order?.creator?.last_name }}
                  )
                </span>
              </span>
            </div>
          </div>

          <div *ngIf="order?.voucher">
            <div>
              {{ 'POS.VOUCHER' | translate }}:
              <span class="font-medium">{{ order?.voucher?.voucher_reference }}</span>
            </div>
          </div>

          <hr />

          <div>
            <div class="flex justify-between  py-1">
              <span>{{ 'POS.SUB_TOTAL' | translate }}</span>
              <span>{{ calc.subTotal | currency }}</span>
            </div>

            <div class="flex justify-between py-1" *ngIf="order?.tip">
              <span>{{ 'POS.TIP' | translate }}</span>
              <span>{{ order?.tip | currency }}</span>
            </div>

            <div class="flex justify-between py-1">
              <span>{{ 'POS.TAX' | translate }}</span>
              <span>{{ order?.tax }}% ({{ calc.tax | currency }})</span>
            </div>

            <div class="flex justify-between py-1" *ngIf="order?.voucher">
              {{ 'POS.VOUCHER_DISCOUNT' | translate }}:
              <span>
                <span *ngIf="order?.voucher?.amount">-{{ calc.voucherDiscount | currency }}</span>
                <span *ngIf="order?.voucher?.percentage"
                  >-{{ order?.voucher?.percentage }}%
                  <span *ngIf="calc.voucherDiscount">({{ calc.voucherDiscount | currency }})</span>
                </span>
              </span>
            </div>

            <div class="flex justify-between font-bold text-2xl py-1">
              <span>{{ 'POS.TOTAL' | translate }}</span>
              <div class="flex items-center gap-2 items-center">
                <span class="text-gray-500 line-through" *ngIf="calc.oldTotal != calc.total"
                  >({{ calc.oldTotal | currency }})</span
                >
                <span *ngIf="calc.oldTotal != calc.total">--></span>
                <span class="font-bold">{{ calc.total | currency }}</span>
              </div>
            </div>
            <div class="flex justify-between  font-bold text-2xl py-1">
              <span>{{ 'POS.PAID' | translate }}</span>
              <span *ngIf="(order?.paid || 0) >= 0"
                >{{ order?.paid | currency }}

                <span
                  class="text-lg text-green-700"
                  *ngIf="(order?.paid || 0) - (order?.total_price || 0) > 0"
                  >( - {{ (order?.paid || 0) - (order?.total_price || 0) | currency }} )
                </span>
              </span>
            </div>
            <div
              class="flex justify-between  py-1 text-green-700 font-bold"
              [ngClass]="{ 'text-red-700': calc.due < 0 }"
            >
              <span>{{ 'POS.DUE' | translate }}</span>
              <span>{{ (calc.due < 0 ? calc.due * -1 : 0) | currency }}</span>
            </div>

            <div
              class="flex justify-between py-1 font-bold"
              [ngClass]="{
                'text-green-700': calc.status === 'refund',
                'text-red-700': calc.status === 'extra',
                'text-blue-600': calc.status === 'settled',
              }"
            >
              <span>
                <ng-container [ngSwitch]="calc.status">
                  <span *ngSwitchCase="'extra'">{{ 'POS.EXTRA_PAYMENT' | translate }}</span>
                  <span *ngSwitchCase="'refund'">{{ 'POS.REFUND' | translate }}</span>
                  <span *ngSwitchCase="'settled'">{{ 'POS.NO_DIFFERENCE' | translate }}</span>
                </ng-container>
              </span>
              <span *ngIf="calc.status !== 'settled'">{{
                (calc.diff < 0 ? calc.diff * -1 : calc.diff) | currency
              }}</span>
            </div>

            <div
              *ngIf="calc.status !== 'settled' && calc.finalDue < 0"
              class="flex justify-between py-1 text-red-700 font-bold"
            >
              <span>{{ 'POS.TOTAL_DUE' | translate }}</span>
              <span>{{ (calc.finalDue < 0 ? calc.finalDue * -1 : calc.finalDue) | currency }}</span>
            </div>

            <!-- Payment -->
            <div class="flex justify-between gap-3 mt-2 text-xl">
              <label class="font-semibold">{{ 'POS.CUSTOMER_PAID' | translate }}</label>
              <div>
                <input
                  pInputText
                  type="number"
                  [(ngModel)]="customerPaid"
                  class="text-xl p-4 border-2 rounded-xl"
                  (ngModelChange)="onCustomerPaidChange($event)"
                />
                <div *ngIf="customerPaidError" class="text-red-500 text-sm mt-1">
                  {{ customerPaidError }}
                </div>
              </div>
            </div>
            <div class="flex justify-between gap-3 mt-2 text-xl">
              <label class="font-semibold">{{ 'POS.CHANGE' | translate }}</label>
              <div class="text-green-700 font-bold" [ngClass]="{ 'text-red-700': change < 0 }">
                {{ change | currency }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="pt-4 flex justify-end gap-3" *ngIf="!isExpired">
        <button
          pButton
          type="button"
          class="p-button-outlined h-[60px] "
          (click)="cancel()"
          [label]="'common.cancel' | translate"
        ></button>
        <button
          pButton
          type="button"
          class="h-[60px] "
          (click)="confirmReturn()"
          [disabled]="!products.length"
          [label]="'POS.CONFIRM_RETURN' | translate"
        ></button>
      </div>
    </div>

    <!-- Expired Order Message -->
    <ng-template #expiredTemplate>
      <div class="p-6 text-center text-red-600 font-bold text-xl">
        {{ 'POS.ORDER_EXPIRED' | translate }}
      </div>
    </ng-template>
  `,
})
export class ReturnOrderDialogComponent extends BaseComponent {
  barcode: string = '';
  products: ProductModel[] = [];
  searchData: Order[] = [];
  selectedIndex = 0;
  order?: Order | null;
  popVisible = false;
  customerPaid = 0;
  customerPaidError: string | null = null;

  calc = {
    subTotal: 0,
    tax: 0,
    total: 0,
    due: 0,
    voucherDiscount: 0,
    oldTotal: 0,
    finalDue: 0,
    diff: 0,
    status: 'settled' as 'extra' | 'refund' | 'settled',
  };

  get change() {
    return !this.customerPaid
      ? this.calc.finalDue
      : this.customerPaid - Math.abs(this.calc.finalDue);
  }

  get isExpired(): boolean {
    if (!this.order?.paid_status || this.order.paid_status === 'IN_PROGRESS') return false;
    if (!this.order?.created_at) return false;
    const createdAt = new Date(this.order.created_at);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 14;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { orderList?: OrderList; order?: Order },
    private dialogRef: MatDialogRef<ReturnOrderDialogComponent>,
    private orderService: OrderService
  ) {
    super();

    if (data?.order) {
      this.order = data.order;
      this.products =
        data.order.productOrders?.map((po) => ({
          product_id: po.product.product_id,
          name: po.product.name,
          price: po.price,
          quantity: po.quantity,
        })) || [];
      this.recalculate();
    } else {
      this.searchTermSubject
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((searchTerm) =>
            this.orderService.getOrders({
              limit: 1000,
              search: searchTerm,
              page: this.pageIndex,
            })
          )
        )
        .subscribe((res) => {
          const { orders } = res;
          this.popVisible = false;
          this.searchData = orders;

          if (orders?.length === 1) {
            this.order = orders[0];
          } else {
            this.order = null;
          }
        });
    }
  }

  onCustomerPaidChange(value: number) {
    this.customerPaid = value;
    if (value && value > 0) {
      this.customerPaidError = null;
    } else if (!value && this.calc.diff > 0) {
      this.customerPaidError = this.translate('POS.CUSTOMER_PAID_REQUIRED');
    }
  }

  onSearchInput(event: any, pop: Popover) {
    const value = typeof event === 'string' ? event.trim : event?.target?.value?.trim();
    if (value) {
      this.searchTermSubject.next(value);
      this.selectedIndex = 0;
      if (!this.popVisible) {
        pop.show(event);
        this.popVisible = true;
      }
    } else {
      pop.hide();
      this.popVisible = false;
    }
  }

  onKeyDown(event: KeyboardEvent, pop: Popover) {
    if (!this.searchData?.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectedIndex = (this.selectedIndex + 1) % this.searchData.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectedIndex =
        (this.selectedIndex - 1 + this.searchData.length) % this.searchData.length;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.selectOrder(this.searchData[this.selectedIndex], pop);
    }
  }

  selectOrder(order: Order, pop: Popover) {
    this.order = order;
    this.products =
      order.productOrders?.map((po) => ({
        product_id: po.product.product_id,
        name: po.product.name,
        price: po.price,
        quantity: po.quantity,
      })) || [];
    this.recalculate();
    this.barcode = order.reference || '';
    pop.hide();
    this.popVisible = false;
  }

  removeProduct(index: number) {
    this.products.splice(index, 1);
    this.recalculate();
  }

  confirmReturn() {
    this.customerPaidError = null;
    if (this.change < 0 && !this.order?.client) {
      this.customerPaidError = this.translate('POS.CUSTOMER_PAID_REQUIRED');
      return;
    }

    const returnOrder: Order = {
      products: this.products.map(({ name, ...rest }) => rest),
      paid: this.customerPaid + (this.order?.paid || 0),
    };

    this.load(this.orderService.updateOrder(this.order?.order_id || 0, returnOrder)).subscribe(
      (res) => {
        this.dialogRef.close(res);
      }
    );
  }

  cancel() {
    this.dialogRef.close(null);
  }

  recalculate() {
    const subTotal = this.products.reduce((sum, p) => sum + (p.price || 0) * (p.quantity || 0), 0);

    const tax = this.order?.tax ? (subTotal * this.order?.tax) / 100 : 0;
    const tip = this.order?.tip || 0;

    let voucherDiscount = 0;
    if (this.order?.voucher) {
      if (this.order?.voucher.amount) {
        voucherDiscount = this.order.voucher.amount;
      } else if (this.order?.voucher.percentage) {
        voucherDiscount = ((subTotal + tax) * this.order.voucher.percentage) / 100;
      }
    }

    const total = Math.max(0, Math.round((subTotal + tax + tip - voucherDiscount) * 100) / 100);
    console.log(total);

    const paid = this.order?.paid || 0;
    const oldTotal = this.order?.total_price || 0;
    const due = paid - oldTotal;
    const diff = total !== 0 ? total - oldTotal : due;

    let status: 'extra' | 'refund' | 'settled' = 'settled';

    if (diff > 0) {
      status = 'extra';
    } else if (diff < 0) {
      status = 'refund';
    }
    console.log(diff);
    console.log(due);
    const finalDue = due > 0 ? 0 - diff : due - diff;

    this.calc = {
      subTotal,
      tax,
      total,
      voucherDiscount,
      oldTotal,
      diff,
      due,
      finalDue,
      status,
    };
  }
}
