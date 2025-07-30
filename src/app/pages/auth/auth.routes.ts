import { Routes } from '@angular/router';
import { Access } from './access';
import { LoginComponent } from './login';
import { RoutesUtil } from '@/shared/utils/routes.util';

export default [
  { path: RoutesUtil.AuthLogin.path, component: LoginComponent },
  { path: RoutesUtil.AuthAccessDenied.path, component: Access },
  // { path: RoutesUtil.AuthError.path, component: Error },
  // { path: RoutesUtil.AuthRegister.path, component: Regester },
  { path: '', redirectTo: RoutesUtil.AuthLogin.path, pathMatch: 'full' },
] as Routes;
