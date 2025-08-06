import { Expose, Transform } from 'class-transformer';
import { Model } from './model';
import { UserRole } from '../enums/user-role.enum';
import { Pagination } from './list';

export class User {
  @Expose() user_id?: number;
  @Expose() email?: string;
  @Expose() role?: UserRole;

  @Expose() first_name?: string;
  @Expose() last_name?: string;

  get userName(): string | undefined {
    if (!this.first_name && !this.last_name) return undefined;
    return `${this.first_name ?? ''} ${this.last_name ?? ''}`.trim();
  }
}

export class AuthResponse extends Model {
  @Expose() user?: User;
  @Expose() token?: string;
}

export class UsersList {
  @Expose() users?: User[];
  @Expose() pagination?: Pagination;
}
