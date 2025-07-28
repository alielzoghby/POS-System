import { Expose, Transform } from "class-transformer";
import { Model } from "./model";
import { UserRole } from "../enums/user-role.enum";
import { list } from "./list";

export class User {
  @Expose() _id?: string;
  @Expose() userName?: string;
  @Expose() email?: string;
  @Expose() role?: UserRole;
  @Expose() code?: string;
  @Expose() updatePassword?: boolean;
  @Expose()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  createdAt?: Date;
  @Expose()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  updatedAt?: Date;
  @Expose()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  lastSeen?: Date;
  @Expose() logged?: boolean;
  @Expose() schoolId?: string;
  @Expose() notifySuperAdmin?: boolean;
  @Expose() termsAndCondition?: boolean;
}

export class AuthResponse extends Model {
  @Expose() user?: User;
  @Expose() token?: string;
}

export class UsersList extends list {
  @Expose() users?: User[];
}
