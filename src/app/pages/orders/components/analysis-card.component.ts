import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-analysis-card',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <p-card [styleClass]="bgClass" class="analysis-card rounded-xl shadow-md w-full">
      <div>
        <h6>{{ title }}</h6>
        <h4>{{ value | number: '1.2-2' | currency }}</h4>
      </div>
    </p-card>
  `,
  styles: [
    `
      .analysis-card {
        width: 220px;
        min-height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .card-content h6 {
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .card-content h4 {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0;
      }
      .bg-primary {
        background-color: #0d6efd;
        color: #ffffff;
      }
      .bg-success {
        background-color: #198754;
        color: #ffffff;
      }
      .bg-warning {
        background-color: #ffc107;
        color: #212529;
      }
      .bg-info {
        background-color: #0dcaf0;
        color: #212529;
      }
      .bg-secondary {
        background-color: #6c757d;
        color: #ffffff;
      }
      .bg-danger {
        background-color: #dc3545;
        color: #ffffff;
      }
    `,
  ],
})
export class AnalysisCardComponent {
  @Input() title!: string;
  @Input() value!: number;
  @Input() bgClass: string = 'bg-primary';
}
