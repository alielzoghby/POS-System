import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtDecoderService } from './jwt-decoder.service';
import { map, tap } from 'rxjs/operators';
import { ApiBaseService } from '../general/api-base.service';
import { ApiConstant } from '../../config/api.constant';
import { filterNullEntity } from '../../utils/filter-null-entity.util';
import { AuthResponse, User, UsersList } from '../../models/user.model';
import { JWTTokenValidation } from '../../enums/JWT-token-validation.enum';
import { Mapper } from '../../mapper/base-mapper.mapper';
import { BaseComponent } from '../../component/base-component/base.component';
import { Router } from '@angular/router';
import { RoutesUtil } from '../../utils/routes.util';
import { UserRole } from '@/shared/enums/user-role.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseComponent {
  public currentUser$: BehaviorSubject<AuthResponse> = new BehaviorSubject(new AuthResponse());
  public redirectionURL = '';

  constructor(
    private baseAPI: ApiBaseService,
    private mapper: Mapper,
    private jwtDecoderService: JwtDecoderService,
    private router: Router
  ) {
    super();
    if (this.jwtDecoderService.isThereValidToken() === JWTTokenValidation.Valid) {
      this.currentUser$.next(this.jwtDecoderService.getCurrentUserFromJWTToken());
    } else {
      this.jwtDecoderService.removeCurrentToken();
      this.router.navigate([RoutesUtil.AuthLogin.url()]);
    }
  }

  saveUser() {
    this.jwtDecoderService.saveToken(JSON.stringify(this.currentUser$.value));
  }

  isLoggedIn(): boolean {
    return this.jwtDecoderService.isThereValidToken() !== JWTTokenValidation.NotFound;
  }

  hasAccessToPage(requiredRoles?: UserRole[]): boolean {
    const userRole = this.getCurrentUserRole();

    if (!userRole) return false;

    if (!requiredRoles || requiredRoles.length === 0) return true;

    return requiredRoles.includes(userRole);
  }

  getCurrentUserRole(): UserRole {
    return this.jwtDecoderService.getCurrentUserFromJWTToken()?.user?.role;
  }

  login(body: { email: string; password: string }): Observable<AuthResponse> {
    return this.baseAPI.post(ApiConstant.LOGIN, filterNullEntity(body)).pipe(
      map((res) => this.mapper.fromJson(AuthResponse, res.data)),
      tap((user) => {
        return this.saveTokenAndUpdateUser(user);
      })
    );
  }

  updatePassword(body: { email: string; password: string }): Observable<User> {
    return this.baseAPI.post(ApiConstant.UPDATE_PASSWORD, filterNullEntity(body)).pipe(
      tap((res) => this.showSuccessMessage(res.responseMessage)),
      map((res) => this.mapper.fromJson(User, res.data.user))
    );
  }

  addUser(body: User): Observable<User> {
    return this.baseAPI
      .post(ApiConstant.ADD_USER, filterNullEntity(body))
      .pipe(map((res) => this.mapper.fromJson(User, res.data.user)));
  }

  private saveTokenAndUpdateUser(user: AuthResponse): void {
    this.jwtDecoderService.saveToken(user?.toJson!());
    this.currentUser$.next(this.jwtDecoderService.getCurrentUserFromJWTToken());
  }

  getAllNotifications(): Observable<any> {
    return this.baseAPI.get(ApiConstant.GET_ALL_NOTIFICATIONS).pipe(map((res) => res.data));
  }

  getNotificationById(id: string): Observable<Notification> {
    return this.baseAPI
      .get(ApiConstant.GET_NOTIFICATION_BY_ID.replace('{id}', id))
      .pipe(map((res) => this.mapper.fromJson(Notification, res.data.notification)));
  }

  markAllAsRead(): Observable<any> {
    return this.baseAPI.patch(ApiConstant.MARK_ALL_AS_READ, {}).pipe(map((res) => res.data));
  }
}
