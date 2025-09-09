import { UserRole } from '../enums/user-role.enum';

export class RolesConstants {
  public static ADD_EDIT_USER = [UserRole.Admin];
  public static EDIT_CONFIGURATION = [UserRole.Admin];
  public static EDIT_SHOW_ORDERS = [UserRole.Admin];
  public static EDIT_SHOW_CLIENTS = [UserRole.Admin];
}
