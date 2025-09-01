// order-list.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SplitButton } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '@/shared/component/base-component/base.component';
import { StateSectionComponent } from '@/shared/component/state-section/state-section.component';
import { Pagination } from '@/shared/models/list';
import { TranslateModule } from '@ngx-translate/core';
import { Order, OrderAnalysis } from '@/pages/orders/models/order.model';
import { OrderService } from '@/pages/orders/services/order.service';
import { FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { InputText } from 'primeng/inputtext';
import { OrdersAnalysisComponent } from '../components/orders-analysis.component';
import { DatePicker } from 'primeng/datepicker';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
  ConfirmDialogSeverity,
} from '@/shared/component/confirm-dialog/confirm-dialog.component';
import { ReceiptTemplateComponent } from '../components/receipt-template';
import { ViewChild } from '@angular/core';
import { LazyDropdownComponent } from '@/shared/component/lazy-dropdown/lazy-dropdown.component';
import { Lookup } from '@/shared/enums/lookup.enum';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule,
    SplitButton,
    StateSectionComponent,
    TranslateModule,
    FormsModule,
    InputText,
    OrdersAnalysisComponent,
    DatePicker,
    ReceiptTemplateComponent,
    LazyDropdownComponent,
  ],
  template: `
    <app-state-section [state]="sectionState">
      <div class="p-6 w-full bg-surface-overlay rounded-xl shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">{{ 'orders.ordersList' | translate }}</h2>
        </div>
        <app-orders-analysis [analysis]="analysis"></app-orders-analysis>

        <hr />
        <div class="flex flex-wrap gap-3 mb-4">
          <input
            type="text"
            pInputText
            placeholder="{{ 'orders.searchPlaceholder' | translate }}"
            class="p-inputtext-sm w-100  h-[40px]"
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearchChange($event)"
          />

          <p-datepicker
            [(ngModel)]="rangeDates"
            selectionMode="range"
            [iconDisplay]="'input'"
            [showIcon]="true"
            [readonlyInput]="true"
            class="w-100  h-[40px]"
            placeholder="{{ 'orders.selectDateRange' | translate }}"
            (onSelect)="onFilterChange()"
          ></p-datepicker>

          <app-lazy-dropdown
            [(ngModel)]="client"
            [lookup]="Lookup.Clients"
            class="w-[350px] h-[40px]"
            [placeholder]="'orders.selectClient' | translate"
            (onSelect)="onFilterChange()"
          ></app-lazy-dropdown>
        </div>
        <p-table
          [value]="orders"
          [paginator]="true"
          [rows]="pageSize"
          [totalRecords]="pagination.totalDocuments || 0"
          [first]="((pagination.currentPage ?? 1) - 1) * pageSize"
          [rowsPerPageOptions]="rowsPerPageOptions"
          [lazy]="true"
          (onLazyLoad)="onPageChange($event)"
          class="shadow-md rounded-md"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>{{ 'orders.Reference' | translate }}</th>
              <th>{{ 'orders.SubTotal' | translate }}</th>
              <th>{{ 'orders.tip' | translate }}</th>
              <th>{{ 'orders.tax' | translate }}</th>
              <th>{{ 'orders.voucher' | translate }}</th>
              <th>{{ 'orders.totalPrice' | translate }}</th>
              <th>{{ 'orders.paid' | translate }}</th>
              <th>{{ 'orders.due' | translate }}</th>
              <th>{{ 'orders.status' | translate }}</th>
              <th>{{ 'orders.payment' | translate }}</th>
              <th>{{ 'orders.products' | translate }}</th>
              <th>{{ 'orders.createdBy' | translate }}</th>
              <th>{{ 'orders.createdAt' | translate }}</th>
              <th>{{ 'common.actions' | translate }}</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-order>
            <tr>
              <td>{{ order.reference }}</td>
              <td>{{ order.sub_total | currency: 'USD' }}</td>
              <td>{{ order.tip | currency: 'USD' }}</td>
              <td>
                <span>{{ order.tax + '% ' }}</span>
                <span>({{ ((order.sub_total || 0) * (order.tax || 0)) / 100 | currency }})</span>
              </td>
              <td>
                <div *ngIf="order.voucher; else noVoucher">
                  <span *ngIf="order.voucher.amount"
                    >-{{ order.voucher.amount | currency }} ({{
                      order.discounted | currency
                    }})</span
                  >
                  <span *ngIf="order.voucher.percentage"
                    >-{{ order.voucher.percentage }}%
                    <span>({{ order.discounted | currency }})</span>
                  </span>
                </div>
                <ng-template #noVoucher>
                  <span>--</span>
                </ng-template>
              </td>
              <td>{{ order.total_price | currency: 'USD' }}</td>
              <td>{{ order.paid | currency: 'USD' }}</td>
              <td>{{ order.due | currency: 'USD' }}</td>
              <td>
                <p-tag
                  [value]="'orders.' + order.paid_status | translate"
                  [severity]="order.paid_status === 'PAID' ? 'success' : 'Warning'"
                ></p-tag>
              </td>
              <td>{{ order.payment_method }}</td>
              <td>{{ order.creator?.first_name }} {{ order.creator?.last_name }}</td>
              <td>
                <!-- make icon on right -->

                <button
                  pButton
                  type="button"
                  class="p-button mb-2 p-button-sm w-full justify-content-between"
                  (click)="toggleProducts(order.order_id)"
                >
                  {{ 'orders.products' | translate }} ({{ order.productOrders?.length || 0 }})
                  <i
                    class="pi"
                    [ngClass]="{
                      'pi-chevron-down': !expandedOrders.has(order.order_id),
                      'pi-chevron-up': expandedOrders.has(order.order_id),
                    }"
                  ></i>
                </button>

                <ul *ngIf="expandedOrders.has(order.order_id)" class="mb-0 ps-3">
                  <li *ngFor="let po of order.productOrders">
                    {{ po.product?.name }} (x{{ po.quantity }})
                  </li>
                </ul>
              </td>
              <td>{{ order.created_at | date: 'short' }}</td>
              <td>
                <p-splitButton
                  [model]="orderActionsMap.get(order.order_id)"
                  icon="pi pi-cog"
                  label="{{ 'common.actions' | translate }}"
                  class="p-button-sm"
                ></p-splitButton>
              </td>
            </tr>
          </ng-template>
        </p-table>

        <!-- Receipt Preview -->
        <div style="display:none">
          <app-receipt-template #receipt [order]="selectedOrder"></app-receipt-template>
        </div>
      </div>
    </app-state-section>
  `,
})
export class OrderListComponent extends BaseComponent {
  @ViewChild('receipt', { static: false }) receiptComponent!: ReceiptTemplateComponent;

  orders: Order[] = [];
  analysis: OrderAnalysis = {} as OrderAnalysis;
  orderActionsMap = new Map<number, MenuItem[]>();
  expandedOrders = new Set<number>();
  globalFilterValue: string = '';
  rangeDates: Date[] = [];
  selectedOrder: Order = {} as Order;
  client!: number;

  protected Lookup = Lookup;
  constructor(
    private orderService: OrderService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    // Debounce search input
    this.searchTermSubject.pipe(debounceTime(500)).subscribe(() => {
      this.getOrders(1, this.pageSize);
    });
  }

  toggleProducts(orderId: number) {
    if (this.expandedOrders.has(orderId)) {
      this.expandedOrders.delete(orderId);
    } else {
      this.expandedOrders.add(orderId);
    }
  }
  buildActions(order: Order): MenuItem[] {
    return [
      {
        label: this.translate('common.view'),
        icon: 'pi pi-eye',
        command: () => this.openViewDialog(order),
      },
      {
        label: this.translate('common.edit'),
        icon: 'pi pi-pencil',
        command: () => this.openEditDialog(order),
      },
      {
        label: this.translate('common.delete'),
        icon: 'pi pi-trash',
        command: () => this.onDelete(order),
      },
    ];
  }

  openViewDialog(order: Order) {
    this.selectedOrder = order;
    setTimeout(() => {
      const receiptHtml = this.receiptComponent.host.nativeElement.innerHTML;

      const printWindow = window.open('', '_blank', 'width=400,height=600');
      if (printWindow) {
        // grab all stylesheets from current document
        const styles = Array.from(document.styleSheets)
          .map((style: any) => {
            try {
              return [...style.cssRules].map((rule) => rule.cssText).join('');
            } catch (e) {
              return '';
            }
          })
          .join('');

        printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>${styles}</style>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=VT323&display=swap" rel="stylesheet" />
        </head>
        <body>${receiptHtml}</body>
      </html>
    `);
        printWindow.document.close();
        printWindow.focus();
        // Auto-print after content loads
        printWindow.onload = () => printWindow.print();
      }
    }, 100);
  }

  openEditDialog(order: Order) {
    // const dialogRef = this.dialog.open(EditOrderDialogComponent, {
    //   data: { order },
    //   width: '600px',
    // });
    // dialogRef.afterClosed().subscribe((updated) => {
    //   if (updated) {
    //     this.getOrders();
    //   }
    // });
  }

  onPageChange(event: any) {
    const page = event.first / event.rows + 1;
    const rows = event.rows;
    this.pageSize = rows;
    this.getOrders(page, rows);
  }

  onFilterChange() {
    this.getOrders(1, this.pageSize);
  }
  getOrders(page: number = 1, limit: number = this.pageSize) {
    const filters: any = {
      page,
      limit,
      search: this.searchTerm,
      client_id: this.client,
    };

    if (this.rangeDates.length === 2) {
      filters.startDate = this.rangeDates[0]?.toISOString();
      filters.endDate = this.rangeDates[1]?.toISOString();
    }

    this.load(this.orderService.getOrders(filters)).subscribe((res) => {
      this.orders = res.orders || [];
      this.analysis = res.analysis || ({} as OrderAnalysis);
      this.pagination = res.pagination || new Pagination();

      this.orders.forEach((order) => {
        if (order.due !== undefined) {
          this.orderActionsMap.set(order.order_id || 0, this.buildActions(order));
        }
      });
    });
  }

  onDelete(order: Order) {
    const data: ConfirmDialogData = {
      title: this.translate('orders.deleteTitle'),
      message: this.translate('orders.deleteMessage', { name: order.reference }),
      confirmText: this.translate('common.delete'),
      cancelText: this.translate('common.cancel'),
      severity: ConfirmDialogSeverity.DANGER,
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data });

    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.load(this.orderService.deleteOrder(order.order_id || 0)).subscribe(() => {
          this.getOrders();
        });
      }
    });
  }
}
