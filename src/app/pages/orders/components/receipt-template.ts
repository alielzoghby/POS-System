import { Order } from '@/pages/orders/models/order.model';
import { ConfigConstant } from '@/shared/config/config.constant';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-receipt-template',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div
      class="receipt-template mx-auto my-4 p-4 max-w-sm bg-white shadow-lg font-mono text-gray-800"
      #receiptRoot
    >
      <!-- Logo -->
      <div class="text-center mb-4">
        <h1 class="text-2xl font-bold">{{ ConfigConstant.APPLICATION_NAME }}</h1>
      </div>

      <!-- Address -->
      <div>
        <p>{{ address }}</p>
        <p>{{ 'receipt.store' | translate }}: {{ storeNumber }}</p>
      </div>

      <!-- Cashier -->
      <div class="mb-3">
        <strong
          >{{ 'receipt.helpedBy' | translate }}: {{ order.created_by?.first_name }}
          {{ order.created_by?.last_name }}</strong
        >
      </div>

      <hr class="my-2 border-gray-300" />

      <!-- Transaction Items -->
      <div class="space-y-1 text-sm px-5">
        <table class="w-full">
          <thead>
            <tr class="uppercase">
              <th class="text-left">{{ 'receipt.product' | translate }}</th>
              <th class="text-left">{{ 'receipt.quantity' | translate }}</th>
              <th class="text-right">{{ 'receipt.price' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of order.productOrders">
              <td>{{ item.product.name }}</td>
              <td>{{ item.quantity }} x {{ item.price | currency }}</td>
              <td class="text-right">{{ item.quantity * item.price | currency }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr class="my-3 border-gray-300" />

      <!-- Survey -->
      <div class="text-center my-3">
        <p class="text-sm mb-1">{{ 'receipt.surveyId' | translate }} #</p>
        <p class="font-bold">{{ order.order_id }}</p>
      </div>

      <!-- Payment Details -->
      <div class="space-y-1 text-sm mb-3 px-[60px]">
        <div class="flex justify-between uppercase">
          <span>{{ 'receipt.Subtotal' | translate }}</span>
          <span>{{ order.sub_total | currency }}</span>
        </div>
        <div class="flex justify-between uppercase">
          <span>{{ 'receipt.tax' | translate: { tax: order.tax } }}</span>
          <span>{{ ((order.sub_total || 0) * (order.tax || 0)) / 100 | currency }}</span>
        </div>

        <div *ngIf="order.voucher" class="flex justify-between font-bold uppercase">
          <span>{{ 'receipt.voucher' | translate }}</span>

          <span *ngIf="order.voucher.amount">-{{ order.voucher.amount | currency }}</span>
          <span *ngIf="order.voucher.percentage"
            >-{{ order.voucher.percentage }}%
            <span>({{ order.discounted || 0 | currency }})</span>
          </span>
        </div>

        <div class="flex justify-between font-bold uppercase">
          <span>{{ 'receipt.total' | translate }}</span>
          <span>{{ order.total_price | currency }}</span>
        </div>
        <div class="flex justify-between uppercase">
          <span>{{ order.payment_method }}</span>
          <span>{{ order.paid | currency }}</span>
        </div>

        <div class="flex justify-between uppercase">
          <span>{{ 'receipt.change' | translate }}</span>
          <span>{{ (order.paid || 0) - (order.total_price || 0) | currency }}</span>
        </div>
      </div>

      <hr class="my-3 border-gray-300" />

      <!-- Barcode -->
      <div class="text-center my-2 flex justify-center">
        <svg id="barcode"></svg>
      </div>

      <!-- Return Policy -->
      <div class="text-center text-sm mb-3">
        <p>
          {{ 'receipt.returnPolicy' | translate: { storeName: ConfigConstant.APPLICATION_NAME } }}
        </p>
        <p>{{ 'receipt.refundMessage' | translate }}</p>
        <div class="flex justify-between mt-1 mx-[50px]">
          <span>{{ order.created_at | date: 'fullDate' }}</span>
          <span>{{ order.created_at | date: 'shortTime' }}</span>
        </div>
      </div>

      <hr class="my-3 border-gray-300" />

      <!-- Feedback -->
      <div class="text-center text-sm">
        <p>**********************************</p>
        <p class="my-2">
          {{ 'receipt.feedbackMessage' | translate }}
        </p>
        <p>{{ ConfigConstant.APPLICATION_NAME }}</p>
        <p class="mt-2">**********************************</p>
      </div>
    </div>
  `,
  styles: [
    `
      .receipt-template {
        font-family: 'VT323', monospace;
        p {
          margin: 0;
        }
      }
    `,
  ],
})
export class ReceiptTemplateComponent {
  @Input() order: Order = new Order();

  protected ConfigConstant = ConfigConstant;
  address: string = '2155 KALAKAUA AVE, HONOLULU, HI';
  storeNumber: string = '808-922-1911';

  constructor(public host: ElementRef) {}

  ngAfterViewInit() {
    if (this.order.reference) {
      JsBarcode('#barcode', this.order.reference, {
        format: 'CODE128',
        lineColor: '#000',
        width: 1.5,
        height: 30,
        displayValue: true,
      });
    }
  }

  ngOnChanges() {
    if (this.order.reference) {
      console.log(this.order.reference);

      JsBarcode('#barcode', this.order.reference, {
        format: 'CODE128',
        lineColor: '#000',
        width: 1.5,
        height: 30,
        displayValue: true,
      });
    }
  }
}
