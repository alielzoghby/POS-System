import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '@/shared/component/base-component/base.component';
import { VoucherService } from '@/pages/voucher/service/voucher-service';
import { SectionStateStatus } from '@/shared/enums/section-state-status.enum';
import { ConfigurationService } from '@/pages/configuration/service/configuration-service';
import { Voucher } from '@/pages/voucher/models/voucher.model';

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
              [class.p-button-success]="selectedTipValue === t"
              (click)="!readonly && selectTip(t)"
              [disabled]="readonly"
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
              class="p-button text-2xl w-[100px] h-[60px] rounded-lg"
              [class.p-button-success]="paymentMethodValue === method.value"
              (click)="!readonly && selectPaymentMethod(method.value)"
              [disabled]="readonly"
            >
              {{ method.label | translate }}
            </button>
          </div>

          <!-- Card Reference -->
          <div *ngIf="paymentMethodValue === 'CARD'" class="mt-3">
            <label class="block text-lg font-semibold">{{
              'POS.CARD_REFERENCE' | translate
            }}</label>
            <input
              pInputText
              [(ngModel)]="cardReference"
              class="w-full text-lg p-4 border-2 rounded-xl"
              placeholder="REF123"
              [disabled]="readonly"
            />
          </div>

          <!-- Voucher Code -->
          <div class="mt-3">
            <div class="flex items-end gap-4">
              <div class="w-full">
                <label class="block text-lg font-semibold">{{
                  'POS.ENTER_VOUCHER' | translate
                }}</label>
                <input
                  pInputText
                  [(ngModel)]="voucherCodeValue"
                  class="w-full text-lg p-4 border-2 rounded-xl"
                  placeholder="ABC123"
                  [disabled]="readonly"
                />
              </div>
              <button
                pButton
                type="button"
                label="{{ 'POS.VALIDATE' | translate }}"
                icon="pi pi-search"
                class="p-button p-button-primary rounded-lg px-2"
                [loading]="sectionState === SectionStateStatus.Loading"
                iconPos="right"
                (click)="!readonly && verifyVoucher()"
                [disabled]="readonly"
              ></button>
            </div>
            <div *ngIf="appliedVoucher" class="text-green-700 font-bold text-lg mt-1">
              {{ 'POS.VOUCHER_DISCOUNT' | translate }}:
              <span *ngIf="appliedVoucher?.amount">-{{ voucherDiscount | currency }}</span>
              <span *ngIf="appliedVoucher?.percentage">-{{ appliedVoucher.percentage }}%</span>
            </div>

            <div *ngIf="voucherInvalid" class="text-red-500 text-lg font-medium mt-1">
              {{ 'POS.INVALID_VOUCHER' | translate }}
            </div>
          </div>
        </div>

        <!-- Totals Section -->
        <div class="grid grid-cols-2 gap-2 border-t border-gray-300 pt-3 text-xl font-medium">
          <div>{{ 'POS.SUBTOTAL' | translate }}</div>
          <div>{{ subtotal | currency }}</div>
          <div>{{ 'POS.TIP' | translate }}</div>
          <div>{{ selectedTipValue | currency }}</div>
          <div>{{ 'POS.TAX' | translate }}</div>
          <div>{{ taxRate }}% ({{ taxAmount | currency }})</div>
          <div *ngIf="appliedVoucher" class="text-green-600">
            {{ 'POS.VOUCHER_DISCOUNT' | translate }}
          </div>
          <div *ngIf="appliedVoucher" class="text-green-600">
            <span *ngIf="appliedVoucher?.amount">-{{ voucherDiscount | currency }}</span>
            <span *ngIf="appliedVoucher?.percentage"
              >-{{ appliedVoucher.percentage }}%
              <span *ngIf="voucherDiscount">({{ voucherDiscount | currency }})</span>
            </span>
          </div>
          <div class="font-bold text-2xl">{{ 'POS.TOTAL' | translate }}</div>
          <div class="font-bold text-2xl text-primary">{{ total | currency }}</div>
        </div>

        <!-- Payment -->
        <div class="grid grid-cols-2 gap-3 mt-2 text-xl">
          <label class="font-semibold">{{ 'POS.CUSTOMER_PAID' | translate }}</label>
          <div>
            <input
              pInputText
              type="number"
              [(ngModel)]="customerPaid"
              class="text-xl p-4 border-2 rounded-xl"
              (ngModelChange)="!readonly && onCustomerPaidChange($event)"
              [disabled]="readonly"
            />
            <div *ngIf="customerPaidError" class="text-red-500 text-sm mt-1">
              {{ customerPaidError }}
            </div>
          </div>

          <label class="font-semibold">{{ 'POS.CHANGE' | translate }}</label>
          <div class="text-green-700 font-bold" [ngClass]="{ 'text-red-700': change < 0 }">
            {{ change | currency }}
          </div>
        </div>
      </div>

      <!-- Checkout Button -->
      <div class="bottom-0 pt-6 border-t border-gray-300 justify-end">
        <button
          pButton
          [label]="'POS.CHECKOUT' | translate"
          class="w-full p-button-success text-2xl h-[60px] rounded-lg"
          (click)="!readonly && onCheckout()"
          [disabled]="readonly"
        ></button>
      </div>
    </div>
  `,
})
export class PosSummaryComponent extends BaseComponent {
  @Input() subtotal = 0;
  @Output() checkout = new EventEmitter<any>();

  @Input() readonly = false; // عند true → كل الحقول معطلة
  @Input() externalTotal?: number;
  @Input() externalChange?: number;
  @Input() externalTip?: number;
  @Input() externalPaymentMethod?: 'CASH' | 'CARD';
  @Input() externalVoucherCode?: string;

  tipOptions = [0, 5, 10, 15, 20];
  selectedTip = 0;

  paymentMethods: { label: string; value: 'CASH' | 'CARD' }[] = [
    { label: 'POS.PAYMENT_CASH', value: 'CASH' },
    { label: 'POS.PAYMENT_CARD', value: 'CARD' },
  ];
  paymentMethod: 'CASH' | 'CARD' = 'CASH';

  customerPaid = 0;
  voucherCode = '';
  voucherDiscount = 0;
  taxRate = 0;
  voucherInvalid = false;
  appliedVoucher!: Voucher;
  cardReference = '';

  customerPaidError: string | null = null;
  protected SectionStateStatus = SectionStateStatus;

  get selectedTipValue() {
    return this.readonly ? (this.externalTip ?? 0) : this.selectedTip;
  }

  get paymentMethodValue() {
    return this.readonly ? (this.externalPaymentMethod ?? 'CASH') : this.paymentMethod;
  }

  get voucherCodeValue() {
    return this.readonly ? (this.externalVoucherCode ?? '') : this.voucherCode;
  }

  get taxAmount() {
    return (this.subtotal * this.taxRate) / 100;
  }

  get total() {
    return this.readonly
      ? (this.externalTotal ?? 0)
      : Math.max(0, this.subtotal + this.taxAmount + this.selectedTip - this.voucherDiscount);
  }

  get change() {
    return this.readonly ? (this.externalChange ?? 0) : this.customerPaid - this.total;
  }

  constructor(
    private configurationService: ConfigurationService,
    private voucherService: VoucherService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getTax();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['subtotal']) {
      this.calculateVoucherDiscount();
    }
  }

  selectTip(tip: number) {
    this.selectedTip = tip;
  }

  selectPaymentMethod(method: 'CASH' | 'CARD') {
    this.paymentMethod = method;
    if (method !== 'CARD') {
      this.cardReference = '';
    }
  }

  getTax() {
    this.load(this.configurationService.getConfiguration()).subscribe((res) => {
      this.taxRate = res.tax;
    });
  }

  onCustomerPaidChange(value: number) {
    this.customerPaid = value;
    if (value && value > 0) {
      this.customerPaidError = null;
    } else if (!value && this.subtotal > 0 && !this.appliedVoucher) {
      this.customerPaidError = this.translate('POS.CUSTOMER_PAID_REQUIRED');
    }
  }

  verifyVoucher() {
    if (this.readonly) return;
    this.load(this.voucherService.getVoucher(this.voucherCode.trim())).subscribe(
      (res) => {
        if (
          res &&
          this.voucherCode &&
          res.active &&
          res.expired_at &&
          new Date(res.expired_at) > new Date()
        ) {
          this.appliedVoucher = res;
          this.voucherDiscount = res.amount ?? (this.subtotal * res.percentage!) / 100;
          this.voucherInvalid = false;
          this.calculateVoucherDiscount();
          return;
        }
        this.voucherDiscount = 0;
        this.voucherInvalid = true;
      },
      () => {
        this.voucherDiscount = 0;
        this.voucherInvalid = true;
      }
    );
  }

  calculateVoucherDiscount() {
    if (this.appliedVoucher) {
      this.voucherDiscount =
        this.appliedVoucher.amount ?? (this.subtotal * (this.appliedVoucher.percentage ?? 0)) / 100;
    }
  }

  onCheckout() {
    if (this.readonly) return;
    this.customerPaidError = null;
    if (this.change < 0) {
      this.customerPaidError = this.translate('POS.CUSTOMER_PAID_REQUIRED');
      return;
    }

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

  reset() {
    this.customerPaid = 0;
    this.voucherCode = '';
    this.cardReference = '';
    this.selectedTip = 0;
    this.paymentMethod = 'CASH';
    this.voucherDiscount = 0;
    this.appliedVoucher = null!;
  }
}
