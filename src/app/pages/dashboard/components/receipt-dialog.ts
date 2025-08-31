import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { Order } from '@/pages/orders/models/order.model';
import { ReceiptTemplateComponent } from '@/pages/orders/components/receipt-template';
@Component({
  selector: 'app-order-created-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule, TranslateModule, ReceiptTemplateComponent],
  template: `
    <div class="p-6 bg-surface-overlay rounded-xl shadow-md max-w-lg">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-green-600">
          {{ 'orders.createdSuccess' | translate }}
        </h2>
      </div>

      <!-- ✅ Success Message -->
      <p class="mb-4 text-nowrap">
        {{ 'orders.createdMessage' | translate }}
      </p>

      <!-- Receipt Preview -->
      <div style="display:none">
        <app-receipt-template #receipt [order]="data"></app-receipt-template>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button
          pButton
          type="button"
          label="{{ 'orders.newOrder' | translate }}"
          class="p-button-success w-[200px] h-[60px]"
          (click)="newOrder()"
        ></button>
        <button
          pButton
          type="button"
          label="{{ 'orders.printReceipt' | translate }}"
          class="p-button-outlined w-[200px] h-[60px]"
          (click)="printReceipt()"
        ></button>
      </div>
    </div>
  `,
})
export class OrderCreatedDialogComponent {
  @ViewChild('receipt', { static: false }) receiptComponent!: ReceiptTemplateComponent;

  constructor(
    public dialogRef: MatDialogRef<OrderCreatedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Order,
    public el: ElementRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.printReceipt(), 100);
  }

  newOrder() {
    this.dialogRef.close({ action: 'newOrder' });
  }

  printReceipt() {
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
  }
}
