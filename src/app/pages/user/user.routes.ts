import { Routes } from '@angular/router';

import { RoutesUtil } from '@/shared/utils/routes.util';
import { ProfileComponent } from './pages/profile.component';
import { UserListComponent } from './pages/user-list.component';

export default [
  { path: RoutesUtil.UserProfile.path, component: ProfileComponent },
  {
    path: RoutesUtil.UserList.path,
    component: UserListComponent,
  },
] as Routes;
