import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { RoutesUtil } from '../utils/routes.util';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate([RoutesUtil.Auth.url()]);
      return false;
    }

    if (!this.authService.hasAccessToPage()) {
      this.router.navigate([RoutesUtil.AuthAccessDenied.url()]);
      return false;
    }

    return true;
  }
}
