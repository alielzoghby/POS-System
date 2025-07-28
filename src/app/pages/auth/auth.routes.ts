import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Error } from './error';
import { RoutesUtil } from '@/shared/utils/routes.util';

export default [
  { path: RoutesUtil.AuthLogin.path, component: Login },
  { path: RoutesUtil.AuthAccessDenied.path, component: Access },
  // { path: RoutesUtil.AuthError.path, component: Error },
  // { path: RoutesUtil.AuthRegister.path, component: Regester },
  { path: '', redirectTo: RoutesUtil.AuthLogin.path, pathMatch: 'full' },
] as Routes;
