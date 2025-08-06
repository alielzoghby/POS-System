import { Routes } from '@angular/router';

import { RoutesUtil } from '@/shared/utils/routes.util';
import { ProfileComponent } from './component/profile.component';
import { UserListComponent } from './component/user-list.component';

export default [
  { path: RoutesUtil.UserProfile.path, component: ProfileComponent },
  {
    path: RoutesUtil.UserList.path,
    component: UserListComponent,
  },
] as Routes;
