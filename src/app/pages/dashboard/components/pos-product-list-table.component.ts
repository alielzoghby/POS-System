import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProductModel } from '@/pages/products/models/product.model';

@Component({
  selector: 'app-pos-product-list-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputNumberModule,
    TranslateModule,
  ],
  template: `
    <p-table
      stripedRows
      [value]="products"
      scrollable="true"
      scrollHeight="100%"
      responsiveLayout="scroll"
      class="text-xl w-full"
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
        <tr class="border-b border-gray-200" [ngClass]="i % 2 === 0 ? 'bg-white' : 'bg-gray-100'">
          <td class="py-4 px-3">{{ product.name }}</td>
          <td class="py-4 px-3">{{ product.price | currency: 'USD' }}</td>
          <td class="py-4 px-3">
            <p-inputNumber
              [(ngModel)]="product.quantity"
              [inputStyleClass]="'w-[50px] text-center'"
              [min]="1"
              inputStyleClass="text-xl px-3 py-2 rounded-lg"
              (onInput)="updateTotal.emit(i)"
              [showButtons]="true"
              buttonLayout="horizontal"
              incrementButtonClass="p-button-sm p-button-rounded"
              decrementButtonClass="p-button-sm p-button-rounded"
            ></p-inputNumber>
          </td>
          <td class="py-4 px-3 font-semibold w-[200px]">
            {{ product.quantity * product.price | currency: 'USD' }}
          </td>
          <td class="py-4 px-3">
            <button
              pButton
              class="p-button-danger w-full h-[60px] rounded-lg"
              (click)="removeProduct.emit(i)"
            >
              <i class="pi pi-trash"></i>
            </button>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class PosProductListTableComponent {
  @Input() products: ProductModel[] = [];
  @Output() removeProduct = new EventEmitter<number>();
  @Output() updateTotal = new EventEmitter<number>();
}
