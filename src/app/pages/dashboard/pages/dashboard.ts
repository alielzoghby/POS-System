import { Component, ViewChild } from '@angular/core';
import { PosSummaryComponent } from '../components/app.pos-summary.component';
import { PosProductTableComponent } from '../components/app.pos-products-table.component';
import { ProductModel } from '@/pages/products/models/product.model';
import { BaseComponent } from '@/shared/component/base-component/base.component';
import { OrderService } from '../../orders/services/order.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderCreatedDialogComponent } from '../../orders/components/receipt-dialog';

@Component({
  selector: 'app-dashboard',
  imports: [PosSummaryComponent, PosProductTableComponent],
  template: `
    <div class="grid grid-cols-12 gap-8 h-full">
      <!-- Products Table Section -->
      <div class="col-span-12 xl:col-span-8 lg:overflow-hidden" style="padding: 6px; margin: -6px">
        <!-- margin and padding to fix shadow issue doesn't visible because of overflow -->

        <app-pos-product-table
          [products]="products"
          (productRemoved)="removeProduct($event)"
          (productUpdated)="calculateTotals()"
        />
      </div>

      <!-- Summary Section -->
      <div class="col-span-12 xl:col-span-4 h-full lg:overflow-hidden">
        <app-pos-summary
          [subtotal]="subtotal"
          [taxRate]="0.14"
          (checkout)="handleCheckout($event)"
        />
      </div>
    </div>
  `,
})
export class Dashboard extends BaseComponent {
  @ViewChild(PosProductTableComponent) productTable!: PosProductTableComponent;
  @ViewChild(PosSummaryComponent) summary!: PosSummaryComponent;

  products: ProductModel[] = [];
  subtotal = 0;

  constructor(
    private orderService: OrderService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    this.calculateTotals();
  }

  calculateTotals() {
    this.subtotal = this.products.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
      0
    );

    this.subtotal = this.products.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
      0
    );
  }

  removeProduct(index: number) {
    this.products.splice(index, 1);
    this.calculateTotals();
  }

  handleCheckout(event: {
    total: number;
    paid: number;
    change: number;
    tip: number;
    method: string;
    voucher: string;
    cardReference: string;
  }) {
    const productsWithoutName = this.products.map(({ name, ...rest }) => rest);

    const order = {
      voucher_reference: event.voucher,
      payment_method: event.method,
      tip: event.tip,
      products: productsWithoutName,
      paid: event.paid,
    };

    this.orderService.createOrder(order).subscribe((response) => {
      const dialogRef = this.dialog.open(OrderCreatedDialogComponent, {
        data: response,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result?.action === 'newOrder') {
          this.products = [];
          this.calculateTotals();

          // Reset child components
          if (this.productTable) this.productTable.reset();
          if (this.summary) this.summary.reset();
        }
      });
    });
  }
}
