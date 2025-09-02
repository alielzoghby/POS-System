import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClientModule } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { ProductService } from '@/pages/products/services/product.service';
import { BaseComponent } from '@/shared/component/base-component/base.component';
import { ProductListModel, ProductModel } from '@/pages/products/models/product.model';
import { Popover } from 'primeng/popover';
import { OrderService } from '@/pages/orders/services/order.service';

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
    Popover,
  ],
  template: `
    <div
      class="bg-surface-overlay rounded-xl shadow-md h-full w-full flex flex-col overflow-hidden p-4"
    >
      <!-- Order / Return Toggle -->
      <div class="mb-4 flex gap-6 items-center">
        <label class="flex items-center gap-2">
          <input type="radio" name="orderType" [(ngModel)]="isReturn" [value]="false" />
          {{ 'POS.ORDER' | translate }}
        </label>
        <label class="flex items-center gap-2">
          <input type="radio" name="orderType" [(ngModel)]="isReturn" [value]="true" />
          {{ 'POS.RETURN' | translate }}
        </label>
      </div>

      <!-- Search Input -->
      <div class="mb-4 flex gap-4 items-center relative">
        <input
          type="text"
          pInputText
          class="text-xl p-3 border-2 h-[60px] rounded-lg w-full"
          [(ngModel)]="searchValue"
          (input)="performSearch(pop)"
          (keydown)="onKeyDown($event, pop)"
          placeholder="{{
            isReturn
              ? ('POS.SEARCH_ORDER_ID' | translate)
              : ('POS.ENTER_PRODUCT_BARCODE' | translate)
          }}"
          #barcodeInput
        />

        <button
          pButton
          type="button"
          label="{{ isReturn ? ('POS.SEARCH' | translate) : ('POS.ADD' | translate) }}"
          icon="pi pi-search"
          class="p-button-success w-[200px] h-[60px] px-6 rounded-lg"
          [loading]="loading"
          (click)="performSearch(pop)"
        ></button>

        <!-- Product Popover (only for normal order) -->
        <p-popover #pop *ngIf="!isReturn">
          <div *ngIf="searchData?.products?.length; else noResults">
            <ul class="list-none m-0 p-0 w-[250px]">
              <li
                *ngFor="let p of searchData.products; let i = index"
                (click)="selectProduct(p, pop)"
                [class.bg-blue-200]="i === selectedIndex"
                class="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {{ p.name }} - {{ p.final_price | currency }}
              </li>
            </ul>
          </div>
          <ng-template #noResults>
            <div class="p-2 text-gray-500">{{ 'No products found' }}</div>
          </ng-template>
        </p-popover>
      </div>

      <!-- Products Table -->
      <div class="flex-1 overflow-auto">
        <p-table
          stripedRows
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
            <tr [ngClass]="i % 2 === 0 ? 'bg-white' : 'bg-gray-100'">
              <td class="py-4 px-3">{{ product.name }}</td>
              <td class="py-4 px-3">{{ product.price | currency: 'USD' }}</td>
              <td class="py-4 px-3">
                <p-inputNumber
                  [(ngModel)]="product.quantity"
                  [inputStyleClass]="'w-[50px] text-center'"
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
                {{ product.quantity * product.price | currency: 'USD' }}
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
export class PosProductTableComponent extends BaseComponent {
  @Input() products: ProductModel[] = [];
  @Output() productRemoved = new EventEmitter<number>();
  @Output() productUpdated = new EventEmitter<void>();
  @ViewChild('barcodeInput') barcodeInput!: ElementRef;
  @ViewChild('pop') pop!: Popover;

  searchValue = '';
  searchData!: ProductListModel;
  loading = false;
  popVisible = false;
  searchSubject = new Subject<string>();
  selectedProduct!: ProductModel | null;
  selectedIndex = 0;

  isReturn = false;

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) {
    super();

    // Product search debounce
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => this.productService.getProducts({ limit: 1000, search: term, page: 1 }))
      )
      .subscribe((res) => {
        this.popVisible = false;
        this.searchData = res;
        this.selectedProduct = res.products?.length === 1 ? res.products[0] : null;
      });
  }

  ngAfterViewInit() {
    this.barcodeInput.nativeElement.focus();
  }

  performSearch(pop: any) {
    if (!this.searchValue) return;

    if (this.isReturn) {
      // Search order for return
      this.loading = true;
      this.load(
        this.orderService.getOrders({ page: 1, limit: 30, search: this.searchValue })
      ).subscribe(
        (res: any) => {
          const order = res.orders?.[0];
          if (order) {
            this.products = order.productOrders.map((po: any) => ({
              product_id: po.product.product_id,
              name: po.product.name,
              price: po.price,
              quantity: po.quantity,
            }));
          }
          this.productUpdated.emit();
          this.loading = false;
        },
        () => {
          this.products = [];
          this.loading = false;
        }
      );
    } else {
      // Search product by barcode
      this.searchSubject.next(this.searchValue);
      this.selectedIndex = 0;
      if (pop && !this.popVisible) {
        pop.show(true);
        this.popVisible = true;
      }
    }
  }

  selectProduct(product: ProductModel, pop: Popover) {
    const existing = this.products.find((p) => p.product_id === product.product_id);
    if (existing) existing.quantity = (existing.quantity || 0) + 1;
    else
      this.products.push({
        product_id: product.product_id,
        name: product.name,
        price: product.final_price,
        quantity: 1,
      });

    this.productUpdated.emit();
    if (pop) {
      pop.hide();
      this.popVisible = false;
    }
    this.searchValue = '';
  }

  removeProduct(index: number) {
    this.productRemoved.emit(index);
  }
  updateTotal(index: number) {
    this.productUpdated.emit();
  }

  onKeyDown(event: KeyboardEvent, pop: Popover) {
    if (!this.searchData?.products?.length || this.isReturn) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectedIndex = (this.selectedIndex + 1) % this.searchData.products.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectedIndex =
        (this.selectedIndex - 1 + this.searchData.products.length) %
        this.searchData.products.length;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.selectProduct(this.searchData.products[this.selectedIndex], pop);
    }
  }

  reset() {
    this.products = [];
    this.searchValue = '';
    this.isReturn = false;
    this.barcodeInput.nativeElement.focus();
  }
}
