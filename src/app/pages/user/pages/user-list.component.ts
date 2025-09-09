import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { TagModule } from 'primeng/tag';
import { User } from '@/shared/models/user.model';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { BaseComponent } from '@/shared/component/base-component/base.component';
import { Pagination } from '@/shared/models/list';
import { SplitButton } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { RoutesUtil } from '@/shared/utils/routes.util';
import { StateSectionComponent } from '@/shared/component/state-section/state-section.component';
import { ButtonModule } from 'primeng/button';
import { EditProfileDialogComponent } from '../component/edit-profile-dialog.component';
import { CreateUserDialogComponent } from '../component/create-user-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TranslateModule,
    TagModule,
    SplitButton,
    StateSectionComponent,
    ButtonModule,
    ButtonModule,
  ],
  template: `
    <app-state-section [state]="sectionState">
      <div class="p-6 w-full  bg-surface-overlay rounded-xl shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-primary">
            {{ 'user.usersList' | translate }}
          </h2>
          <button
            pButton
            icon="pi pi-plus"
            class="h-[60px]"
            label="{{ 'user.create' | translate }}"
            (click)="openCreateDialog()"
          ></button>
        </div>

        <p-table
          [value]="users"
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
              <th>{{ 'user.userName' | translate }}</th>
              <th>{{ 'user.email' | translate }}</th>
              <th>{{ 'user.role' | translate }}</th>
              <th>{{ 'common.actions' | translate }}</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-user>
            <tr>
              <td>{{ user.first_name }} {{ user.last_name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ 'user.' + user.role | translate }}</td>
              <td>
                <p-splitButton
                  [model]="userActionsMap.get(user.user_id)"
                  icon="pi pi-cog"
                  label="{{ 'common.actions' | translate }}"
                  class="p-button-sm"
                ></p-splitButton>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </app-state-section>
  `,
})
export class UserListComponent extends BaseComponent {
  users: User[] = [];
  userActionsMap = new Map<number, MenuItem[]>();

  constructor(
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog
  ) {
    super();
  }

  buildActions(user: User): MenuItem[] {
    return [
      {
        label: this.translate('common.details'),
        icon: 'pi pi-eye',
        command: () => {
          this.router.navigate([RoutesUtil.UserProfile.url({ params: { id: user.user_id } })]);
        },
      },
      {
        label: this.translate('common.edit'),
        icon: 'pi pi-pencil',
        command: () => this.openEditDialog('profile', user),
      },
      {
        label: this.translate('profile.changePassword'),
        icon: 'pi pi-key',
        command: () => this.openEditDialog('password', user),
      },
    ];
  }
  openEditDialog(type: 'profile' | 'password', user: User) {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      data: { type, user },
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getUsers();
      }
    });
  }

  openCreateDialog(): void {
    this.dialog
      .open(CreateUserDialogComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.getUsers();
        }
      });
  }

  onPageChange(event: any): void {
    const page = event.first / event.rows + 1;
    const rows = event.rows;
    this.pageSize = rows;
    this.getUsers(page, rows);
  }

  getUsers(page: number = this.pageIndex, limit: number = this.pageSize): void {
    this.load(this.userService.getUsers({ page, limit }), {
      isLoadingTransparent: true,
    }).subscribe((res) => {
      this.users = res.users || [];
      this.users.forEach((user) => {
        if (user.user_id !== undefined) {
          this.userActionsMap.set(user.user_id, this.buildActions(user));
        }
      });
      this.pagination = res.pagination ?? new Pagination();
    });
  }
}
