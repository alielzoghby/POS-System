import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Voucher, VoucherList } from '../models/voucher.model';
import { BaseComponent } from '@/shared/component/base-component/base.component';
import { VoucherService } from '../service/voucher-service';
import { Pagination } from '@/shared/models/list';

import { MatDialog } from '@angular/material/dialog';
import { StateSectionComponent } from '@/shared/component/state-section/state-section.component';
import { VoucherDialogComponent, VoucherDialogData } from '../components/voucher-add-edit-dialog';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
  ConfirmDialogSeverity,
} from '@/shared/component/confirm-dialog/confirm-dialog.component';
import { VoucherPrintComponent } from '../components/voucher-print-component';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-voucher-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TableModule,
    FormsModule,
    PaginatorModule,
    ButtonModule,
    CardModule,
    StateSectionComponent,
    InputText,
    Tooltip,
  ],
  template: `
    <app-state-section [state]="sectionState">
      <div class="p-6 w-full  bg-surface-overlay rounded-xl shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-primary">
            {{ 'voucher.title' | translate }}
          </h2>

          <button
            pButton
            icon="pi pi-plus"
            class="h-[60px]"
            label="{{ 'user.create' | translate }}"
            (click)="openCreateDialog()"
          ></button>
        </div>

        <div>
          <input
            pInputText
            type="text"
            placeholder="{{ 'common.search' | translate }}"
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearchChange($event)"
            class="mb-4"
          />
        </div>

        <!-- Voucher Table -->
        <p-table
          [value]="vouchers"
          [paginator]="true"
          [rows]="pageSize"
          [totalRecords]="pagination.totalDocuments || 0"
          [first]="((pagination!.currentPage ?? 1) - 1) * pageSize"
          [rowsPerPageOptions]="rowsPerPageOptions"
          [lazy]="true"
          (onLazyLoad)="onPageChange($event)"
          class="shadow-md rounded-md"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>{{ 'voucher.reference' | translate }}</th>
              <th>{{ 'voucher.percentage' | translate }}</th>
              <th>{{ 'voucher.amount' | translate }}</th>
              <th>{{ 'voucher.active' | translate }}</th>
              <th>{{ 'voucher.expiredAt' | translate }}</th>
              <th>{{ 'voucher.customerDiscount' | translate }}</th>
              <th class="text-end">{{ 'actions' | translate }}</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-voucher>
            <tr>
              <td>{{ voucher.voucher_reference || '--' }}</td>
              <td>{{ voucher.percentage || '--' }} <span *ngIf="voucher.percentage">%</span></td>
              <td>{{ (voucher.amount | number: '1.2-2') || '--' }}</td>

              <!-- Active -->
              <td>
                <span
                  class="px-2 py-1 rounded text-xs font-medium"
                  [ngClass]="{
                    'bg-green-100 text-green-700': voucher.active,
                    'bg-red-100 text-red-700': !voucher.active,
                  }"
                >
                  {{
                    voucher.active ? ('common.active' | translate) : ('common.inactive' | translate)
                  }}
                </span>
              </td>
              <!-- Expired At -->
              <td>
                {{ voucher.expired_at | date: 'mediumDate' }}
                <span *ngIf="checkExpired(voucher)" class="text-red-500">
                  ({{ 'voucher.expired' | translate }})
                </span>
              </td>

              <!-- Multiple / Customer Discount -->
              <td>{{ (voucher.multiple ? 'common.yes' : 'common.no') | translate }}</td>

              <!-- Actions -->
              <td class="text-end">
                <button
                  pButton
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-text p-button-info"
                  (click)="onEdit(voucher)"
                  [pTooltip]="'common.edit' | translate"
                ></button>
                <button
                  pButton
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-text p-button-danger"
                  (click)="onDelete(voucher)"
                  [pTooltip]="'common.delete' | translate"
                ></button>
                <button
                  pButton
                  icon="pi pi-print"
                  class="p-button-rounded p-button-text p-button-warning"
                  (click)="onPrint(voucher)"
                  [pTooltip]="'common.print' | translate"
                ></button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </app-state-section>
  `,
})
export class VoucherListComponent extends BaseComponent implements OnInit {
  vouchers: Voucher[] = [];
  loading = false;

  constructor(
    private voucherService: VoucherService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.searchTermSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe((term) => {
      this.loadVouchers();
    });
  }

  loadVouchers(page: number = this.pageIndex, limit: number = this.pageSize) {
    this.loading = true;
    this.load(this.voucherService.getVouchers({ page, limit, search: this.searchTerm })).subscribe(
      (res: VoucherList) => {
        this.vouchers = res.vouchers;
        this.pagination = res.pagination || new Pagination();
        this.loading = false;
      }
    );
  }

  onPageChange(event: any) {
    const page = event.first / event.rows + 1;
    const rows = event.rows;
    this.pageSize = rows;
    this.loadVouchers(page, rows);
  }

  openCreateDialog(mode: 'create' | 'edit' = 'create', voucher?: Voucher) {
    const dialogRef = this.dialog.open<VoucherDialogComponent, VoucherDialogData, Voucher>(
      VoucherDialogComponent,
      {
        width: '450px',
        data: { mode, voucher },
        disableClose: true,
      }
    );

    dialogRef.afterClosed().subscribe((voucher) => {
      if (voucher) {
        if (mode === 'create') {
          this.voucherService.createVoucher(voucher).subscribe(() => this.loadVouchers());
        } else {
          this.voucherService
            .updateVoucher(voucher.voucher_id || '', voucher)
            .subscribe(() => this.loadVouchers());
        }
      }
    });
  }

  onEdit(voucher: Voucher) {
    this.openCreateDialog('edit', voucher);
  }

  onDelete(voucher: Voucher) {
    const data: ConfirmDialogData = {
      title: this.translate('voucher.deleteTitle'),
      message: this.translate('voucher.deleteMessage', { name: voucher.voucher_reference }),
      confirmText: this.translate('common.delete'),
      cancelText: this.translate('common.cancel'),
      severity: ConfirmDialogSeverity.DANGER,
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data });

    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.load(this.voucherService.deleteVoucher(voucher.voucher_id || ''), {
          isLoadingTransparent: true,
        }).subscribe(() => {
          this.loadVouchers();
        });
      }
    });
  }

  onPrint(voucher: Voucher) {
    this.dialog.open(VoucherPrintComponent, {
      data: { voucher },
      disableClose: true,
    });
  }

  checkExpired(voucher: Voucher): boolean | undefined {
    return voucher.expired_at && new Date(voucher.expired_at) < new Date();
  }
}
