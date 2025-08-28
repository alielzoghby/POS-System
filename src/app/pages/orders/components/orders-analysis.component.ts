import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderAnalysis } from '../models/order.model';
import { BaseComponent } from '@/shared/component/base-component/base.component';
import { AnalysisCardComponent } from './analysis-card.component';

@Component({
  selector: 'app-orders-analysis',
  standalone: true,
  imports: [CommonModule, AnalysisCardComponent],
  template: `
    <div class="flex justify-center flex-wrap gap-3 my-4">
      <ng-container *ngFor="let item of cards">
        <app-analysis-card [title]="item.title" [value]="item.value" [bgClass]="item.bgClass">
        </app-analysis-card>
      </ng-container>
    </div>
  `,
})
export class OrdersAnalysisComponent extends BaseComponent {
  @Input() analysis: OrderAnalysis = {} as OrderAnalysis;

  constructor() {
    super();
  }
  get cards() {
    return [
      {
        title: this.translate('ordersAnalysis.totalSubTotal'),
        value: this.analysis.totalSubTotal,
        bgClass: 'bg-primary',
      },
      {
        title: this.translate('ordersAnalysis.totalTaxAmount'),
        value: this.analysis.totalTaxAmount,
        bgClass: 'bg-info',
      },
      {
        title: this.translate('ordersAnalysis.totalDiscounted'),
        value: this.analysis.totalDiscounted,
        bgClass: 'bg-success',
      },
      {
        title: this.translate('ordersAnalysis.totalDue'),
        value: this.analysis.totalDue,
        bgClass: 'bg-warning',
      },
      {
        title: this.translate('ordersAnalysis.totalTip'),
        value: this.analysis.totalTip,
        bgClass: 'bg-secondary',
      },
      {
        title: this.translate('ordersAnalysis.totalTotalPrice'),
        value: this.analysis.totalTotalPrice,
        bgClass: 'bg-danger',
      },
    ];
  }
}
