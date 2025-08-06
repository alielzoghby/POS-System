import { ApiConstant } from '@/shared/config/api.constant';
import { Mapper } from '@/shared/mapper/base-mapper.mapper';
import { ApiBaseService } from '@/shared/services/general/api-base.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private baseAPI: ApiBaseService,
    private mapper: Mapper
  ) {}

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
