import { Order } from '@/pages/orders/models/order.model';
import { ConfigConstant } from '@/shared/config/config.constant';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import JsBarcode from 'jsbarcode';
import { ProductModel } from '../models/product.model';

@Component({
  selector: 'app-product-price-tag-template',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div
      class="receipt-template w-[95mm] h-[45mm] mx-auto p-1 max-w-sm bg-white shadow-lg font-mono text-gray-800"
      #receiptRoot
    >
      <table class="w-full h-full border-collapse p-1">
        <tr class="align-top">
          <!-- First Column: Product Name vertical -->
          <td class="w-12 relative px-2 border-r border-gray-300" rowspan="4">
            <div
              class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90 origin-center"
            >
              <p class="text-xl font-bold text-nowrap">{{ product.name }}</p>
            </div>
          </td>

          <!-- Middle Column: Product Details -->
          <td class="px-2 border-r border-gray-300">
            <div class="flex items-center h-full">
              <div class="flex flex-col justify-between uppercase ">
                <span class="font-bold">{{ 'receipt.Weight' | translate }}</span>
                <span>{{ product.unit_value }} {{ 'product.' + product.unit | translate }}</span>
              </div>
            </div>
          </td>

          <td>
            <div class="flex items-center h-full">
              <div class="px-2 flex flex-col justify-between uppercase">
                <span class="font-bold text-nowrap">{{
                  'receipt.Price_per_unit' | translate
                }}</span>
                <span>
                  {{ product.unit_price | currency }}/{{ 'product.' + product.unit | translate }}
                </span>
              </div>
            </div>
          </td>

          <!-- Last Column: Price & Barcode vertical -->
          <td class="w-23 relative px-2 border-l border-gray-300" rowspan="4">
            <div
              class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90"
            >
              <!-- Logo -->
              <div class="text-center">
                <span class="text-lg font-bold">{{ ConfigConstant.APPLICATION_NAME }}</span>
              </div>

              <div class="flex justify-center">
                <svg id="barcode" class="h-15"></svg>
              </div>
            </div>
          </td>
        </tr>

        <tr>
          <td class="px-2 border-r border-gray-300">
            <div class="flex items-center h-full">
              <div class="flex flex-col justify-between uppercase">
                <span class="font-bold text-nowrap">{{
                  'receipt.expirationDate' | translate
                }}</span>
                <span class="text-sm">{{ product.expiration_date | date: 'longDate' }}</span>
              </div>
            </div>
          </td>

          <td>
            <div class="flex items-center h-full">
              <div class="px-2 flex flex-col justify-between uppercase">
                <span class="font-bold">{{ 'receipt.LOT' | translate }}</span>
                <span class="text-sm">{{ product.lot }}</span>
              </div>
            </div>
          </td>
        </tr>

        <tr>
          <td class="px-2 border-t border-b border-gray-300" colspan="2">
            <div class="flex items-center h-full">
              <div class="flex flex-col justify-between uppercase">
                <span class="font-bold">{{ 'receipt.dateAndTime' | translate }}</span>
                <span>{{ product.created_at | date: 'medium' }}</span>
              </div>
            </div>
          </td>
        </tr>

        <tr>
          <td colspan="2">
            <div class="flex justify-between items-center px-4 text-xl font-bold">
              <span>{{ 'receipt.finalPrice' | translate }}</span>
              <span class="text-2xl">{{ product.final_price | currency }}</span>
            </div>
          </td>
        </tr>
      </table>
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
export class ProductPriceTagTemplateComponent {
  @Input() product: ProductModel = new ProductModel();

  protected ConfigConstant = ConfigConstant;

  constructor(public host: ElementRef) {}

  ngAfterViewInit() {
    if (this.product.reference) {
      JsBarcode('#barcode', this.product.reference, {
        format: 'CODE128',
        lineColor: '#000',
        width: 1,
        height: 15,
        displayValue: true,
      });
    }
  }

  ngOnChanges() {
    if (this.product.reference) {
      JsBarcode('#barcode', this.product.reference, {
        format: 'CODE128',
        lineColor: '#000',
        width: 1.5,
        height: 30,
        displayValue: true,
      });
    }
  }
}
