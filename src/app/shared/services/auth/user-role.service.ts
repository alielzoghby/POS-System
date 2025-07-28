import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { UserRole } from '../../enums/user-role.enum';

@Injectable({
  providedIn: 'root',
})
export class UserRoleService {
  constructor(private authService: AuthService) {}

  isUserHasRoles(roles: UserRole[]): boolean {
    const userRoles = this.authService.currentUser$?.value?.user?.role ?? "";

    for (const role of roles) {
      const userRole = userRoles === role;
      if (userRole) {
        return true;
      }
    }
    return false;
  }
}
