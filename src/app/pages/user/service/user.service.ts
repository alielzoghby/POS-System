import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiBaseService } from '@/shared/services/general/api-base.service';
import { Mapper } from '@/shared/mapper/base-mapper.mapper';
import { ApiConstant } from '@/shared/config/api.constant';
import { filterNullEntity } from '@/shared/utils/filter-null-entity.util';
import { User, UsersList } from '@/shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private baseAPI: ApiBaseService,
    private mapper: Mapper
  ) {}

  getUser(userId: string): Observable<User> {
    return this.baseAPI
      .get(ApiConstant.GET_USER.replace('{id}', userId))
      .pipe(map((res) => this.mapper.fromJson(User, res.data)));
  }

  getUsers(body: { page: number; limit: number }): Observable<UsersList> {
    return this.baseAPI
      .get(ApiConstant.GET_USERS, { params: filterNullEntity(body) })
      .pipe(map((res) => this.mapper.fromJson(UsersList, res.data)));
  }

  addUser(body: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }): Observable<User> {
    return this.baseAPI
      .post(ApiConstant.ADD_USER, filterNullEntity(body))
      .pipe(map((res) => this.mapper.fromJson(User, res.data)));
  }

  updateUser(
    userId: string,
    body: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
    }
  ): Observable<User> {
    return this.baseAPI
      .patch(ApiConstant.UPDATE_USER.replace('{id}', userId), filterNullEntity(body))
      .pipe(map((res) => this.mapper.fromJson(User, res.data)));
  }
}
