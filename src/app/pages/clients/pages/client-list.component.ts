import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { BaseComponent } from '@/shared/component/base-component/base.component';
import { StateSectionComponent } from '@/shared/component/state-section/state-section.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
  ConfirmDialogSeverity,
} from '@/shared/component/confirm-dialog/confirm-dialog.component';

import { Client, ClientList } from '../models/client.model';
import { Pagination } from '@/shared/models/list';
import { ClientService } from '../clients.service';
import {
  ClientDialogComponent,
  ClientDialogData,
} from '../components/client-add-edit-dialog.component';

@Component({
  selector: 'app-client-list',
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
    InputTextModule,
    TooltipModule,
  ],
  template: `
    <app-state-section [state]="sectionState">
      <div class="p-6 w-full bg-surface-overlay rounded-xl shadow-md">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-primary">
            {{ 'client.title' | translate }}
          </h2>

          <button
            pButton
            icon="pi pi-plus"
            class="h-[50px]"
            label="{{ 'client.create' | translate }}"
            (click)="openCreateDialog()"
          ></button>
        </div>

        <!-- Search -->
        <div class="mb-4">
          <input
            pInputText
            type="text"
            placeholder="{{ 'common.search' | translate }}"
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearchChange($event)"
            class="w-full md:w-1/3"
          />
        </div>

        <!-- Client Table -->
        <p-table
          [value]="clients"
          [paginator]="true"
          [rows]="pageSize"
          [totalRecords]="pagination.totalDocuments || 0"
          [first]="((pagination.currentPage ?? 1) - 1) * pageSize"
          [rowsPerPageOptions]="rowsPerPageOptions"
          [lazy]="true"
          (onLazyLoad)="onPageChange($event)"
          class="shadow-md rounded-md"
        >
          <!-- Table Header -->
          <ng-template pTemplate="header">
            <tr>
              <th>{{ 'client.name' | translate }}</th>
              <th>{{ 'client.email' | translate }}</th>
              <th>{{ 'client.company' | translate }}</th>
              <th>{{ 'client.phone' | translate }}</th>
              <th>{{ 'client.address' | translate }}</th>
              <th>{{ 'client.active' | translate }}</th>
              <th class="text-end">{{ 'actions' | translate }}</th>
            </tr>
          </ng-template>

          <!-- Table Body -->
          <ng-template pTemplate="body" let-client>
            <tr>
              <!-- Name -->
              <td>
                <span class="font-medium text-gray-800">
                  {{ client.first_name }} {{ client.last_name }}
                </span>
                <span *ngIf="client.title" class="ml-1 text-sm text-gray-500">
                  ({{ client.title }})
                </span>
              </td>

              <!-- Email -->
              <td>
                <a href="mailto:{{ client.email }}" class="text-primary hover:underline">{{
                  client.email
                }}</a>
              </td>

              <!-- Company -->
              <td>{{ client.company || '--' }}</td>

              <!-- Phone -->
              <td>
                <ng-container *ngIf="client.phoneNumbers?.length; else noPhone">
                  <!-- Show Primary -->
                  <div>
                    <span class="font-medium">{{
                      getPrimaryPhone(client.phoneNumbers)?.phone_number
                    }}</span>
                    <span class="text-xs text-gray-500 ml-1">
                      ({{ getPrimaryPhone(client.phoneNumbers)?.phone_type }})
                    </span>
                    <span class="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                      Primary
                    </span>

                    <!-- Toggle Button -->
                    <button
                      pButton
                      type="button"
                      icon="pi pi-chevron-down"
                      class="p-button-text p-button-sm ml-2"
                      *ngIf="client.phoneNumbers.length > 1"
                      (click)="client.showPhones = !client.showPhones"
                    ></button>
                  </div>

                  <!-- Collapsible List -->
                  <div *ngIf="client.showPhones" class="mt-2 pl-4 border-l border-gray-200">
                    <ul class="list-none p-0 m-0">
                      <li
                        *ngFor="let phone of client.phoneNumbers"
                        class="text-sm"
                        [ngClass]="{ 'font-semibold': phone.is_primary }"
                      >
                        {{ phone.phone_number }}
                        <span class="text-xs text-gray-500 ml-1">({{ phone.phone_type }})</span>
                      </li>
                    </ul>
                  </div>
                </ng-container>
                <ng-template #noPhone>--</ng-template>
              </td>

              <!-- Address -->
              <td>
                <ng-container *ngIf="client.addresses?.length; else noAddress">
                  <!-- Show Primary -->
                  <div>
                    <span class="font-medium">
                      {{ getPrimaryAddress(client.addresses)?.street }},
                      {{ getPrimaryAddress(client.addresses)?.city }}
                    </span>
                    <span class="text-xs text-gray-500">
                      {{ getPrimaryAddress(client.addresses)?.country }}
                    </span>
                    <span class="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                      Primary
                    </span>

                    <!-- Toggle Button -->
                    <button
                      pButton
                      type="button"
                      icon="pi pi-chevron-down"
                      class="p-button-text p-button-sm ml-2"
                      *ngIf="client.addresses.length > 1"
                      (click)="client.showAddresses = !client.showAddresses"
                    ></button>
                  </div>

                  <!-- Collapsible List -->
                  <div *ngIf="client.showAddresses" class="mt-2 pl-4 border-l border-gray-200">
                    <ul class="list-none p-0 m-0">
                      <li
                        *ngFor="let addr of client.addresses"
                        class="text-sm"
                        [ngClass]="{ 'font-semibold': addr.is_primary }"
                      >
                        {{ addr.street }}, {{ addr.city }}
                        <span *ngIf="addr.state">, {{ addr.state }}</span>
                        <span *ngIf="addr.postal_code"> ({{ addr.postal_code }})</span>
                        - {{ addr.country }}
                      </li>
                    </ul>
                  </div>
                </ng-container>
                <ng-template #noAddress>--</ng-template>
              </td>

              <!-- Active Status -->
              <td>
                <span
                  class="px-2 py-1 rounded text-xs font-medium"
                  [ngClass]="{
                    'bg-green-100 text-green-700': client.active,
                    'bg-red-100 text-red-700': !client.active,
                  }"
                >
                  {{
                    client.active ? ('common.active' | translate) : ('common.inactive' | translate)
                  }}
                </span>
              </td>

              <!-- Actions -->
              <td class="text-end">
                <button
                  pButton
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-text p-button-info"
                  (click)="onEdit(client)"
                  [pTooltip]="'common.edit' | translate"
                ></button>

                <button
                  pButton
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-text p-button-danger"
                  (click)="onDelete(client)"
                  [pTooltip]="'common.delete' | translate"
                ></button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </app-state-section>
  `,
})
export class ClientListComponent extends BaseComponent implements OnInit {
  clients: Client[] = [];
  loading = false;

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.searchTermSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.loadClients();
    });
  }

  getPrimaryPhone(phones: any[]) {
    return phones.find((p) => p.is_primary) || phones[0];
  }

  getPrimaryAddress(addresses: any[]) {
    return addresses.find((a) => a.is_primary) || addresses[0];
  }

  loadClients(page: number = this.pageIndex, limit: number = this.pageSize) {
    this.loading = true;
    this.load(this.clientService.getClients({ page, limit, search: this.searchTerm })).subscribe(
      (res: ClientList) => {
        this.clients = res.clients;
        this.pagination = res.pagination || new Pagination();
        this.loading = false;
      }
    );
  }

  onPageChange(event: any) {
    const page = event.first / event.rows + 1;
    const rows = event.rows;
    this.pageSize = rows;
    this.loadClients(page, rows);
  }

  openCreateDialog(mode: 'create' | 'edit' = 'create', client?: Client) {
    const dialogRef = this.dialog.open<ClientDialogComponent, ClientDialogData, Client>(
      ClientDialogComponent,
      {
        width: '500px',
        data: { mode, client },
        disableClose: true,
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (mode === 'create') {
          this.clientService.createClient(result).subscribe(() => this.loadClients());
        } else {
          this.clientService
            .updateClient(result.client_id, result)
            .subscribe(() => this.loadClients());
        }
      }
    });
  }

  onEdit(client: Client) {
    this.openCreateDialog('edit', client);
  }

  onDelete(client: Client) {
    const data: ConfirmDialogData = {
      title: this.translate('client.deleteTitle'),
      message: this.translate('client.deleteMessage', {
        name: `${client.first_name} ${client.last_name}`,
      }),
      confirmText: this.translate('common.delete'),
      cancelText: this.translate('common.cancel'),
      severity: ConfirmDialogSeverity.DANGER,
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data });

    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.load(this.clientService.deleteClient(client.client_id), {
          isLoadingTransparent: true,
        }).subscribe(() => this.loadClients());
      }
    });
  }
}
