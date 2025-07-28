import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { RoutesUtil } from '../utils/routes.util';

@Injectable({ providedIn: 'root' })
export class WildcardRedirectGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate([RoutesUtil.AuthLogin.url()]);
      return false;
    }

    return true;
  }
}
