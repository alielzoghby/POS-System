import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/pages/dashboard';
import { Notfound } from './app/pages/notfound/notfound';

import { RoutesUtil } from '@/shared/utils/routes.util';
import { AuthGuard } from '@/shared/guards/auth.guard';
import { GuestGuard } from '@/shared/guards/guest.guard';
import { WildcardRedirectGuard } from '@/shared/guards/wildcard-redirect.guard';
import { Landing } from '@/pages/landing/pages/landing';
import { ConfigurationComponent } from '@/pages/configuration/pages/configuration.component';
import { VoucherListComponent } from '@/pages/voucher/pages/voucher-list.component';
import { OrderListComponent } from '@/pages/orders/pages/order-list.component';
import { ClientListComponent } from '@/pages/clients/pages/client-list.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: RoutesUtil.Auth.path,
    pathMatch: 'full',
  },

  // protected app routes - only if logged in
  {
    path: '',
    component: AppLayout,
    canActivate: [AuthGuard],
    children: [
      { path: RoutesUtil.Dashboard.path, component: Dashboard },
      { path: RoutesUtil.User.path, loadChildren: () => import('./app/pages/user/user.routes') },
      {
        path: RoutesUtil.Category.path,
        loadChildren: () => import('./app/pages/categories/category.routes'),
      },
      {
        path: RoutesUtil.Product.path,
        loadChildren: () => import('./app/pages/products/product.routes'),
      },
      {
        path: RoutesUtil.Configuration.path,
        component: ConfigurationComponent,
      },
      {
        path: RoutesUtil.Voucher.path,
        component: VoucherListComponent,
      },
      {
        path: RoutesUtil.Order.path,
        component: OrderListComponent,
      },
      {
        path: RoutesUtil.Client.path,
        component: ClientListComponent,
      },
    ],
  },

  //   public landing page (guest only)
  // {
  //   path: RoutesUtil.LandingPage.path,
  //   component: Landing,
  //   canActivate: [GuestGuard],
  // },

  // auth routes (login, register...) - only if NOT logged in
  {
    path: RoutesUtil.Auth.path,
    loadChildren: () => import('./app/pages/auth/auth.routes'),
    canActivate: [GuestGuard],
  },

  // not found route
  {
    path: RoutesUtil.NotFound.path,
    component: Notfound,
  },

  // wildcard
  {
    path: '**',
    canActivate: [WildcardRedirectGuard],
    component: Notfound,
  },
];
