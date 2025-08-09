import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pos-summary',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, TranslateModule],
  template: `
    <div
      class=" bg-surface-overlay rounded-xl shadow-md h-full w-full p-4 text-lg justify-between flex flex-col gap-4 overflow-auto"
    >
      <div class="flex flex-col gap-3">
        <!-- Tip Section -->
        <div>
          <label class="block mb-4 font-bold text-xl">{{ 'POS.ADD_TIP' | translate }}</label>
          <div class="flex gap-4 flex-wrap">
            <button
              *ngFor="let t of tipOptions"
              class="p-button w-[75px] h-[60px] text-xl rounded-xl justify-center items-center"
              [class.p-button-success]="selectedTip === t"
              (click)="selectTip(t)"
            >
              {{ t | currency }}
            </button>
          </div>
        </div>

        <!-- Payment Method -->
        <div>
          <label class="block mb-4 font-bold text-xl">{{ 'POS.PAYMENT_METHOD' | translate }}</label>
          <div class="flex gap-6 flex-wrap">
            <button
              *ngFor="let method of paymentMethods"
              class="p-button text-2xl  w-[100px] h-[60px] rounded-lg"
              [class.p-button-success]="paymentMethod === method.value"
              (click)="selectPaymentMethod(method.value)"
            >
              {{ method.label | translate }}
            </button>
          </div>

          <!-- Voucher Code -->
          <div *ngIf="paymentMethod === 'voucher'" class="mt-3 ">
            <div class="flex items-end gap-4">
              <div class="w-full">
                <label class="block text-lg font-semibold">{{
                  'POS.ENTER_VOUCHER' | translate
                }}</label>
                <input
                  pInputText
                  [(ngModel)]="voucherCode"
                  class="w-full text-lg p-4 border-2 rounded-xl"
                  placeholder="ABC123"
                />
              </div>
              <button
                pButton
                type="button"
                label="{{ 'POS.VALIDATE' | translate }}"
                icon="pi pi-search"
                class="p-button p-button-primary rounded-lg"
                [loading]="loading"
                iconPos="right"
                (click)="verifyVoucher()"
              ></button>
            </div>
            <div *ngIf="voucherDiscount > 0" class="text-green-700 font-bold text-lg">
              {{ 'POS.VOUCHER_DISCOUNT' | translate }}: -{{ voucherDiscount | currency }}
            </div>
            <div *ngIf="voucherInvalid" class="text-red-500 text-lg font-medium">
              {{ 'POS.INVALID_VOUCHER' | translate }}
            </div>
          </div>

          <!-- Card Reference -->
          <div *ngIf="paymentMethod === 'card'" class="mt-3">
            <label class="block text-lg font-semibold">{{
              'POS.CARD_REFERENCE' | translate
            }}</label>
            <input
              pInputText
              [(ngModel)]="cardReference"
              class="w-full text-lg p-4 border-2 rounded-xl"
              placeholder="REF123"
            />
          </div>
        </div>

        <!-- Totals Section -->
        <div class="grid grid-cols-2 gap-2 border-t border-gray-300 pt-6 mt-3 text-xl font-medium">
          <div>{{ 'POS.SUBTOTAL' | translate }}</div>
          <div>{{ subtotal | currency }}</div>
          <div>{{ 'POS.TIP' | translate }}</div>
          <div>{{ selectedTip | currency }}</div>
          <div>{{ 'POS.TAX' | translate }}</div>
          <div>{{ taxAmount | currency }}</div>
          <div *ngIf="voucherDiscount > 0" class="text-green-600">
            {{ 'POS.VOUCHER_DISCOUNT' | translate }}
          </div>
          <div *ngIf="voucherDiscount > 0" class="text-green-600">
            -{{ voucherDiscount | currency }}
          </div>
          <div class="font-bold text-2xl">{{ 'POS.TOTAL' | translate }}</div>
          <div class="font-bold text-2xl text-red-700">{{ total | currency }}</div>
        </div>

        <!-- Payment -->
        <div class="grid grid-cols-2 gap-6 mt-3 text-xl">
          <label class="font-semibold">{{ 'POS.CUSTOMER_PAID' | translate }}</label>
          <input
            pInputText
            type="number"
            [(ngModel)]="customerPaid"
            class="text-xl p-4 border-2 rounded-xl"
          />
          <label class="font-semibold">{{ 'POS.CHANGE' | translate }}</label>
          <div class="text-green-700 font-bold">{{ change | currency }}</div>
        </div>
      </div>

      <!-- Checkout Button -->
      <div class="bottom-0 pt-6 border-t border-gray-300 justify-end">
        <button
          pButton
          [label]="'POS.CHECKOUT' | translate"
          class="w-full p-button-success text-2xl h-[60px] rounded-lg"
          (click)="onCheckout()"
        ></button>
      </div>
    </div>
  `,
})
export class PosSummaryComponent {
  @Input() subtotal = 0;
  @Input() taxRate = 0.14;
  @Output() checkout = new EventEmitter<any>();

  tipOptions = [0, 5, 10, 15, 20];
  selectedTip = 0;
  loading = false;

  paymentMethods: { label: string; value: 'cash' | 'card' | 'voucher' }[] = [
    { label: 'POS.PAYMENT_CASH', value: 'cash' },
    { label: 'POS.PAYMENT_CARD', value: 'card' },
    { label: 'POS.PAYMENT_VOUCHER', value: 'voucher' },
  ];
  paymentMethod: 'cash' | 'card' | 'voucher' = 'cash';

  customerPaid = 0;
  voucherCode = '';
  voucherDiscount = 0;
  voucherInvalid = false;
  cardReference = '';

  constructor(private http: HttpClient) {}

  get taxAmount() {
    return this.subtotal * this.taxRate;
  }

  get total() {
    return Math.max(0, this.subtotal + this.taxAmount + this.selectedTip - this.voucherDiscount);
  }

  get change() {
    return this.customerPaid - this.total;
  }

  selectTip(tip: number) {
    this.selectedTip = tip;
  }

  selectPaymentMethod(method: 'cash' | 'card' | 'voucher') {
    this.paymentMethod = method;
    // Reset related fields
    if (method !== 'voucher') {
      this.voucherCode = '';
      this.voucherDiscount = 0;
      this.voucherInvalid = false;
    }
    if (method !== 'card') {
      this.cardReference = '';
    }
  }

  verifyVoucher() {
    // Simulated API call
    this.http.get<{ discount: number }>(`/api/voucher/${this.voucherCode}`).subscribe({
      next: (res) => {
        this.voucherDiscount = res.discount;
        this.voucherInvalid = false;
      },
      error: () => {
        this.voucherDiscount = 0;
        this.voucherInvalid = true;
      },
    });
  }

  onCheckout() {
    this.checkout.emit({
      total: this.total,
      paid: this.customerPaid,
      change: this.change,
      tip: this.selectedTip,
      method: this.paymentMethod,
      voucher: this.voucherCode,
      cardReference: this.cardReference,
    });
  }
}
