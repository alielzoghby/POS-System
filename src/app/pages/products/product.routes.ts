import { Routes } from '@angular/router';

import { RoutesUtil } from '@/shared/utils/routes.util';
import { ProductListComponent } from './pages/product-list.component';

export default [{ path: RoutesUtil.ProductList.path, component: ProductListComponent }] as Routes;
