import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SectionStateStatus } from '@/shared/enums/section-state-status.enum';
import { StateSectionComponent } from '@/shared/component/state-section/state-section.component';
import { BaseComponent } from '@/shared/component/base-component/base.component';
import { ProductModel, ProductStatus } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { TranslateModule } from '@ngx-translate/core';
import { Tooltip } from 'primeng/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../component/product-dialog.component';
import { D } from 'node_modules/@angular/cdk/bidi-module.d-IN1Vp56w';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    TagModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    StateSectionComponent,
    TranslateModule,
    Tooltip,
  ],
  providers: [CurrencyPipe, DatePipe],
  template: `
    <app-state-section [state]="sectionState">
      <div class="p-6 bg-surface-overlay rounded-xl shadow-md w-full">
        <p-toolbar styleClass="mb-6">
          <ng-template #start>
            <p-button
              label="{{ 'product.new' | translate }}"
              icon="pi pi-plus"
              severity="secondary"
              class="mr-2"
              (onClick)="openNew()"
            />
            <p-button
              severity="secondary"
              label="{{ 'common.delete' | translate }}"
              icon="pi pi-trash"
              outlined
              (onClick)="deleteSelectedProducts()"
              [disabled]="!selectedProducts || !selectedProducts.length"
            />
          </ng-template>
        </p-toolbar>

        <p-table
          #dt
          [value]="products"
          [paginator]="true"
          [globalFilterFields]="['name', 'reference', 'category.name', 'status']"
          [(selection)]="selectedProducts"
          [rowHover]="true"
          dataKey="product_id"
          [tableStyle]="{ 'min-width': '75rem' }"
          [showCurrentPageReport]="true"
          [rows]="pageSize"
          [totalRecords]="pagination.totalDocuments || 0"
          [first]="((pagination!.currentPage ?? 1) - 1) * pageSize"
          [rowsPerPageOptions]="rowsPerPageOptions"
          [lazy]="true"
          (onLazyLoad)="onPageChange($event)"
          class="shadow-md rounded-md"
        >
          <ng-template #caption>
            <div class="flex items-center justify-between">
              <h5 class="mb-0">{{ 'product.manage_products' | translate }}</h5>
              <p-iconfield>
                <p-inputicon styleClass="pi pi-search" />
                <input
                  pInputText
                  type="text"
                  (input)="onGlobalFilter(dt, $event)"
                  [placeholder]="'common.search' | translate"
                />
              </p-iconfield>
            </div>
          </ng-template>

          <ng-template pTemplate="header">
            <tr>
              <th style="width: 3rem">
                <p-tableHeaderCheckbox />
              </th>
              <th>{{ 'product.name' | translate }}</th>
              <th>{{ 'product.reference' | translate }}</th>
              <th>{{ 'product.lot' | translate }}</th>
              <th>{{ 'product.image' | translate }}</th>
              <th>{{ 'product.base_price' | translate }}</th>
              <th>{{ 'product.final_price' | translate }}</th>
              <th>{{ 'product.category' | translate }}</th>
              <th>{{ 'product.quantity' | translate }}</th>
              <th>{{ 'product.status' | translate }}</th>
              <th>{{ 'product.expiration' | translate }}</th>
              <th>{{ 'common.actions' | translate }}</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-product>
            <tr>
              <td>
                <p-tableCheckbox [value]="product" />
              </td>
              <td>{{ product.name }}</td>
              <td>{{ product.reference }}</td>
              <td>{{ product.lot }}</td>
              <td>
                <img
                  [src]="product.image"
                  [alt]="product.name"
                  style="width: 64px ; height: 64px"
                  class="rounded"
                />
              </td>
              <td>{{ product.base_price | currency }}</td>
              <td>{{ product.final_price | currency }}</td>
              <td>{{ product.category?.name }}</td>
              <td>{{ product.quantity }}</td>
              <td>
                <p-tag
                  [value]="'product.' + product.status | translate"
                  [severity]="getStatusSeverity(product.status)"
                  class="text-nowrap"
                ></p-tag>
              </td>
              <td>{{ product.expiration_date | date: 'dd/MM/yyyy' }}</td>
              <td>
                <p-button
                  icon="pi pi-pencil"
                  class="mr-2"
                  [rounded]="true"
                  [outlined]="true"
                  (click)="editProduct(product)"
                  [pTooltip]="'common.edit' | translate"
                />
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  [rounded]="true"
                  [outlined]="true"
                  (click)="deleteProduct(product)"
                  [pTooltip]="'common.delete' | translate"
                />
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </app-state-section>
  `,
})
export class ProductListComponent extends BaseComponent {
  products!: ProductModel[];
  selectedProducts: ProductModel[] = [];
  globalFilterValue: string = '';

  constructor(
    private productService: ProductService,
    private dialog: MatDialog
  ) {
    super();
    this.searchTermSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchTerm) =>
          this.productService.getProducts({
            limit: this.pageSize,
            search: searchTerm,
            page: this.pageIndex,
          })
        )
      )
      .subscribe((res) => {
        this.products = res.products || [];
        this.pagination = res.pagination || {};
      });
  }

  getStatusSeverity(status: ProductStatus): string {
    switch (status) {
      case ProductStatus.InStock:
        return 'success';
      case ProductStatus.LowStock:
        return 'warning';
      case ProductStatus.OutOfStock:
        return 'danger';
      default:
        return 'secondary';
    }
  }

  onGlobalFilter(table: any, event: Event) {
    const input = event.target as HTMLInputElement;
    this.globalFilterValue = input.value;
    this.searchTermSubject?.next(this.globalFilterValue);
  }

  onPageChange(event: any): void {
    const page = event.first / event.rows + 1;
    const rows = event.rows;
    this.pageSize = rows;
    this.getProducts(page, rows);
  }

  getProducts(page: number = this.pageIndex, limit: number = this.pageSize): void {
    this.load(this.productService.getProducts({ page, limit, search: this.globalFilterValue }), {
      isLoadingTransparent: true,
    }).subscribe((res) => {
      this.products = res.products || [];
      this.pagination = res.pagination || {};
    });
  }

  openNew(product?: ProductModel) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      data: { product },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.load(this.productService.addProduct(result)).subscribe(
          (newProduct) => {
            this.products.push(newProduct);
          },
          (error) => {
            this.openNew(result);
          }
        );
      }
    });
  }

  editProduct(product: ProductModel) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      data: { product },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.load(this.productService.updateProduct(product.product_id || '', result)).subscribe(
          (updatedProduct) => {
            this.getProducts();
          },
          (error) => {
            this.editProduct(product);
          }
        );
      }
    });
  }

  deleteProduct(product: ProductModel) {
    this.load(this.productService.deleteProduct([product.product_id || ''])).subscribe(() => {
      this.getProducts();
    });
  }

  deleteSelectedProducts() {
    if (this.selectedProducts.length === 0) return;

    const productIds = this.selectedProducts.map((p) => p.product_id || '');
    this.load(this.productService.deleteProduct(productIds)).subscribe(() => {
      this.getProducts();
    });
  }
}
