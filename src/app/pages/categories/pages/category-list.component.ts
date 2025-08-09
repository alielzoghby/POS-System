import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '@/shared/component/base-component/base.component';
import { StateSectionComponent } from '@/shared/component/state-section/state-section.component';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { CategoryService } from '../service/category.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
  ConfirmDialogSeverity,
} from '@/shared/component/confirm-dialog/confirm-dialog.component';
import {
  CategoryDialogComponent,
  CategoryDialogData,
} from '../components/create-edit-dialog.component';
import { CategoryModel } from '../model/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ChipModule,
    ButtonModule,
    StateSectionComponent,
    MenuModule,
  ],
  template: `
    <app-state-section [state]="sectionState">
      <div class="p-6 bg-surface-overlay rounded-xl shadow-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">
            {{ 'category.title' | translate }}
          </h2>
          <button
            pButton
            icon="pi pi-plus"
            class="h-[60px]"
            label="{{ 'category.create' | translate }}"
            (click)="createCategory()"
          ></button>
        </div>

        <div class="flex items-center gap-2 gap-y-6 flex-col sm:flex-row flex-wrap">
          <p-chip *ngFor="let category of categories" class="m-1">
            <div class="flex items-center">
              <span>{{ category.name }}</span>
              <i
                class="pi pi-pencil ml-2 text-primary cursor-pointer"
                (click)="showMenu($event, category)"
                title="{{ 'common.actions' | translate }}"
              ></i>
            </div>
          </p-chip>

          <p-menu #menu [popup]="true" [appendTo]="'body'" [model]="menuItems"></p-menu>
        </div>
      </div>
    </app-state-section>
  `,
})
export class CategoryListComponent extends BaseComponent {
  @ViewChild('menu') menu!: Menu;
  menuItems: MenuItem[] = [];
  selectedCategory: any;

  categories!: CategoryModel[];

  constructor(
    private dialog: MatDialog,
    private categoryService: CategoryService
  ) {
    super();
    this.getCategoryList();
  }

  showMenu(event: MouseEvent, category: any) {
    this.selectedCategory = category;
    this.menuItems = [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editCategory(category),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteCategory(category),
      },
    ];
    this.menu.toggle(event);
  }

  getCategoryList() {
    this.load(this.categoryService.getCategoryList()).subscribe((res: any) => {
      this.categories = res.categories;
    });
  }

  createCategory() {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      data: {
        mode: 'create',
      } satisfies CategoryDialogData,
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.load(this.categoryService.addCategory(result), {
          isLoadingTransparent: true,
        }).subscribe(() => this.getCategoryList());
      }
    });
  }

  editCategory(category: CategoryModel) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      data: {
        mode: 'edit',
        category,
      } satisfies CategoryDialogData,
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.load(this.categoryService.updateCategory(`${category.category_id}`, result), {
          isLoadingTransparent: true,
        }).subscribe(() => this.getCategoryList());
      }
    });
  }

  deleteCategory(category: CategoryModel) {
    const data: ConfirmDialogData = {
      title: this.translate('category.deleteTitle'),
      message: this.translate('category.deleteMessage', { name: category.name }),
      confirmText: this.translate('common.delete'),
      cancelText: this.translate('common.cancel'),
      severity: ConfirmDialogSeverity.DANGER,
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.load(this.categoryService.deleteCategory(category.category_id), {
          isLoadingTransparent: true,
        }).subscribe(() => {
          this.getCategoryList();
        });
      }
    });
  }
}
