import { Routes } from '@angular/router';
import { RoutesUtil } from '@/shared/utils/routes.util';
import { CategoryListComponent } from './pages/category-list.component';

export default [
  { path: RoutesUtil.CategoryList.path, component: CategoryListComponent },
] satisfies Routes;
