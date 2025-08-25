import { Component, Input, AfterViewInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import JsBarcode from 'jsbarcode';
import { Voucher } from '../models/voucher.model';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-voucher-print',
  standalone: true,
  imports: [CommonModule, ButtonModule, TranslateModule],
  template: `
    <div class="p-4 bg-surface-overlay rounded-xl shadow-md">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 lass="text-lg font-bold mb-2">{{ 'voucher.title' | translate }}</h2>

        <button
          pButton
          icon="pi pi-times"
          class="p-button-rounded p-button-text p-button-sm"
          (click)="dialogRef.close()"
          type="button"
          aria-label="Close"
        ></button>
      </div>

      <div class="coupon voucher-print">
        <div class="left">
          <div>{{ 'voucher.enjoy' | translate }}</div>
        </div>
        <div class="center">
          <div>
            <h2>
              <strong *ngIf="data.voucher?.amount" style="font-size: 50px;">{{
                data.voucher.amount | currency
              }}</strong>
              <strong *ngIf="data.voucher?.percentage" style="font-size: 50px;"
                >{{ data.voucher.percentage }}%</strong
              >
              {{ 'voucher.off' | translate }}
            </h2>
            <h3>{{ 'voucher.Coupon' | translate }}</h3>
            <!-- <small>Valid until May, 2023</small> -->
          </div>
        </div>
        <div class="right">
          <div><svg id="barcode"></svg></div>
        </div>
      </div>

      <div class="text-right mt-4">
        <button
          pButton
          type="button"
          label="{{ 'common.print' | translate }}"
          (click)="print()"
        ></button>
      </div>
    </div>
  `,
  styles: [
    `
      .coupon {
        width: fit-content;
        height: 200px;
        border-radius: 10px;
        overflow: hidden;
        margin: auto;
        filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.5));
        display: flex;
        align-items: stretch;
        position: relative;
        text-transform: uppercase;
      }
      .coupon::before,
      .coupon::after {
        content: '';
        position: absolute;
        top: 0;
        width: 50%;
        height: 100%;
        z-index: -1;
      }

      .coupon::before {
        left: 0;
        background-image: radial-gradient(circle at 0 50%, transparent 25px, gold 26px);
      }

      .coupon::after {
        right: 0;
        background-image: radial-gradient(circle at 100% 50%, transparent 25px, gold 26px);
      }

      .coupon > div {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .left {
        width: 20%;
        border-right: 2px dashed rgba(0, 0, 0, 0.13);
      }
      .left div {
        transform: rotate(-90deg);
        white-space: nowrap;
        font-weight: bold;
      }

      .center {
        flex-grow: 1;
        text-align: center;
      }

      .right {
        width: 120px;
        background-image: radial-gradient(circle at 100% 50%, transparent 25px, #fff 26px);
      }
      .right div {
        font-family: 'Libre Barcode 128 Text', cursive;
        font-size: 2.5rem;
        font-weight: 400;
        transform: rotate(-90deg);
      }

      .center h2 {
        background: #000;
        color: gold;
        padding: 0 10px;
        font-size: 2.15rem;
        white-space: nowrap;
      }

      .center h3 {
        font-size: 2.15rem;
      }
      .center small {
        font-size: 0.625rem;
        font-weight: 600;
        letter-spacing: 2px;
      }
    `,
  ],
})
export class VoucherPrintComponent implements AfterViewInit {
  constructor(
    public dialogRef: MatDialogRef<VoucherPrintComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { voucher: Voucher }
  ) {}

  ngAfterViewInit() {
    if (this.data.voucher?.voucher_refrence) {
      JsBarcode('#barcode', this.data.voucher.voucher_refrence, {
        format: 'CODE128',
        lineColor: '#000',
        width: 2,
        height: 50,
        displayValue: true,
      });
    }
  }

  print() {
    const printContents = document.querySelector('.voucher-print')?.outerHTML;
    if (printContents) {
      const popupWin = window.open('', '_blank', 'width=400,height=600');
      if (popupWin) {
        popupWin.document.open();
        popupWin.document.write(`
        <html>
          <head>
            <title>Voucher</title>
            <style>
              body { font-family: Arial; padding: 10px; }
              .coupon {
                width: fit-content;
                height: 200px;
                border-radius: 10px;
                overflow: hidden;
                margin: auto;
                filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.5));
                display: flex;
                align-items: stretch;
                position: relative;
                text-transform: uppercase;
              }
              .coupon::before,
              .coupon::after {
                content: '';
                position: absolute;
                top: 0;
                width: 50%;
                height: 100%;
                z-index: -1;
              }
              .coupon::before {
                left: 0;
                background-image: radial-gradient(circle at 0 50%, transparent 25px, gold 26px);
              }
              .coupon::after {
                right: 0;
                background-image: radial-gradient(circle at 100% 50%, transparent 25px, gold 26px);
              }
              .coupon > div {
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .left {
                width: 20%;
                border-right: 2px dashed rgba(0, 0, 0, 0.13);
              }
              .left div {
                transform: rotate(-90deg);
                white-space: nowrap;
                font-weight: bold;
              }
              .center {
                flex-grow: 1;
                text-align: center;
              }
              .right {
                width: 120px;
                background-image: radial-gradient(circle at 100% 50%, transparent 25px, #fff 26px);
              }
              .right div {
                font-family: 'Libre Barcode 128 Text', cursive;
                font-size: 2.5rem;
                font-weight: 400;
                transform: rotate(-90deg);
              }
              .center h2 {
                background: #000;
                color: gold;
                padding: 0 10px;
                font-size: 2.15rem;
                white-space: nowrap;
              }
              .center h3 {
                font-size: 2.15rem;
              }
              .center small {
                font-size: 0.625rem;
                font-weight: 600;
                letter-spacing: 2px;
              }
            </style>
          </head>
          <body>${printContents}</body>
        </html>
      `);
        popupWin.document.close();
        popupWin.print();
      }
    }
  }
}
