import { RolesConstants } from './../../../shared/config/roles-constants';
import { GrantAccessDirective } from './../../../shared/directive/grant-access.directive';
import { BaseComponent } from '@/shared/component/base-component/base.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../service/user.service';
import { StateSectionComponent } from '@/shared/component/state-section/state-section.component';
import { User } from '@/shared/models/user.model';
import { Button } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditProfileDialogComponent } from '../component/edit-profile-dialog.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    StateSectionComponent,
    GrantAccessDirective,
    Button,
    TranslateModule,
    MatDialogModule,
  ],
  template: `
    <app-state-section [state]="sectionState">
      <div
        class="bg-surface-overlay shadow-md rounded-xl p-8 flex flex-col lg:flex-row gap-8 items-center"
      >
        <!-- Avatar -->
        <img
          src="assets/img/profile.png"
          alt="Avatar"
          class="w-40 h-40 rounded-full border-4 border-primary shadow-md object-cover"
        />

        <!-- Info -->
        <div class="flex-1 w-full">
          <h2 class="text-3xl font-bold mb-2">{{ user.userName }}</h2>
          <h6 class="mb-1">
            <strong>{{ 'profile.email' | translate }}:</strong> {{ user.email }}
          </h6>
          <h6 class="mb-1">
            <strong>{{ 'profile.role' | translate }}:</strong> {{ user.role }}
          </h6>

          <div class="mt-6 flex gap-4 flex-wrap" *grantAccess="RolesConstants.ADD_EDIT_USER">
            <p-button
              [rounded]="true"
              severity="primary"
              icon="pi pi-user-edit"
              [label]="'profile.editProfile' | translate"
              (onClick)="openEditDialog('profile')"
            ></p-button>
            <p-button
              [rounded]="true"
              severity="danger"
              icon="pi pi-key"
              [label]="'profile.changePassword' | translate"
              (onClick)="openEditDialog('password')"
            ></p-button>
          </div>
        </div>
      </div>
    </app-state-section>
  `,
})
export class ProfileComponent extends BaseComponent implements OnInit {
  user: User = new User();
  protected readonly RolesConstants = RolesConstants;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.load(this.userService.getUser(id), {
      isLoadingTransparent: true,
    }).subscribe((res) => {
      this.user = res;
    });
  }

  openEditDialog(type: 'profile' | 'password') {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      data: { type, user: this.user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getUser();
      }
    });
  }
}
