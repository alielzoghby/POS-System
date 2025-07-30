import { Component } from '@angular/core';
import { PosSummaryComponent } from './components/app.pos-summary.component';
import { PosProductTableComponent } from './components/app.pos-products-table.component';

@Component({
  selector: 'app-dashboard',
  imports: [PosSummaryComponent, PosProductTableComponent],
  template: `
    <div class="grid grid-cols-12 gap-8 h-full">
      <!-- Products Table Section -->
      <div class="col-span-12 xl:col-span-8 lg:overflow-hidden">
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
export class Dashboard {
  products = [
    { name: 'Cappuccino', unitPrice: 4.5, quantity: 2 },
    { name: 'Cheeseburger', unitPrice: 8.0, quantity: 1 },
    { name: 'Chocolate Cake', unitPrice: 5.5, quantity: 1 },
    { name: 'Cappuccino', unitPrice: 4.5, quantity: 2 },
    { name: 'Cheeseburger', unitPrice: 8.0, quantity: 1 },
    { name: 'Chocolate Cake', unitPrice: 5.5, quantity: 1 },
    { name: 'Cappuccino', unitPrice: 4.5, quantity: 2 },
    { name: 'Cheeseburger', unitPrice: 8.0, quantity: 1 },
    { name: 'Chocolate Cake', unitPrice: 5.5, quantity: 1 },
    { name: 'Cappuccino', unitPrice: 4.5, quantity: 2 },
    { name: 'Cheeseburger', unitPrice: 8.0, quantity: 1 },
    { name: 'Chocolate Cake', unitPrice: 5.5, quantity: 1 },
    { name: 'Cappuccino', unitPrice: 4.5, quantity: 2 },
    { name: 'Cheeseburger', unitPrice: 8.0, quantity: 1 },
    { name: 'Chocolate Cake', unitPrice: 5.5, quantity: 1 },
  ];

  subtotal = 0;

  ngOnInit() {
    this.calculateTotals();
  }

  calculateTotals() {
    this.subtotal = this.products.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  }

  removeProduct(index: number) {
    this.products.splice(index, 1);
    this.calculateTotals();
  }

  handleCheckout(event: any) {
    console.log('Checkout:', event);
    // send to BE or show confirmation
  }
}
