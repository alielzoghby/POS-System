import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-pos-product-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    HttpClientModule,
    TranslateModule,
  ],
  template: `
    <div
      class="bg-surface-overlay rounded-xl shadow-md h-full w-full flex flex-col overflow-hidden p-4"
    >
      <!-- Barcode Input -->
      <div class="mb-4 flex gap-4 items-center">
        <input
          type="text"
          pInputText
          class="text-xl p-3 border-2 h-[60px] rounded-lg w-full"
          [(ngModel)]="barcode"
          (keydown.enter)="searchProductByBarcode()"
          placeholder="{{ 'POS.ENTER_BARCODE' | translate }}"
        />
        <button
          pButton
          class="p-button-success w-[200px] h-[60px] px-6 rounded-lg"
          (click)="searchProductByBarcode()"
        >
          {{ 'POS.ADD' | translate }}
        </button>
      </div>

      <!-- Products Table -->
      <div class="flex-1 overflow-auto">
        <p-table
          [value]="products"
          scrollable="true"
          scrollHeight="100%"
          responsiveLayout="scroll"
          class="text-xl"
          [style]="{ 'font-size': '1.25rem' }"
        >
          <ng-template pTemplate="header">
            <tr class="bg-blue text-xl">
              <th class="py-4 px-3">{{ 'POS.PRODUCT' | translate }}</th>
              <th class="py-4 px-3">{{ 'POS.UNIT_PRICE' | translate }}</th>
              <th class="py-4 px-3">{{ 'POS.QUANTITY' | translate }}</th>
              <th class="py-4 px-3">{{ 'POS.TOTAL' | translate }}</th>
              <th class="py-4 px-3">{{ 'POS.ACTIONS' | translate }}</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-product let-i="rowIndex">
            <tr
              class="border-b border-gray-200"
              [ngClass]="i % 2 === 0 ? 'bg-white' : 'bg-gray-100'"
            >
              <td class="py-4 px-3">{{ product.name }}</td>
              <td class="py-4 px-3">{{ product.unitPrice | currency: 'USD' }}</td>
              <td class="py-4 px-3">
                <p-inputNumber
                  [(ngModel)]="product.quantity"
                  [min]="1"
                  inputStyleClass="text-xl px-3 py-2 rounded-lg"
                  (onInput)="updateTotal(i)"
                  [showButtons]="true"
                  buttonLayout="horizontal"
                  incrementButtonClass="p-button-sm p-button-rounded"
                  decrementButtonClass="p-button-sm p-button-rounded"
                ></p-inputNumber>
              </td>
              <td class="py-4 px-3 font-semibold w-[200px]">
                {{ product.quantity * product.unitPrice | currency: 'USD' }}
              </td>
              <td class="py-4 px-3">
                <button
                  pButton
                  class="p-button-danger w-full h-[60px] rounded-lg"
                  (click)="removeProduct(i)"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
})
export class PosProductTableComponent {
  @Input() products: { name: string; unitPrice: number; quantity: number }[] = [];
  @Output() productRemoved = new EventEmitter<number>();
  @Output() productUpdated = new EventEmitter<void>();

  barcode: string = '';

  constructor(private http: HttpClient) {}

  removeProduct(index: number) {
    this.productRemoved.emit(index);
  }

  updateTotal(index: number) {
    this.productUpdated.emit();
  }

  searchProductByBarcode() {
    const trimmed = this.barcode.trim();
    if (!trimmed) return;

    this.http
      .get<{ name: string; unitPrice: number }>(`/api/products/barcode/${trimmed}`)
      .subscribe({
        next: (product) => {
          const existing = this.products.find((p) => p.name === product.name);
          if (existing) {
            existing.quantity += 1;
          } else {
            this.products.push({ ...product, quantity: 1 });
          }

          this.productUpdated.emit();
          this.barcode = '';

          // ✅ صوت نجاح
          new Audio('assets/success.mp3').play();
        },
        error: () => {
          // ❌ صوت فشل
          new Audio('assets/fail.mp3').play();
        },
      });
  }
}
