import { ApiConstant } from '@/shared/config/api.constant';
import { Mapper } from '@/shared/mapper/base-mapper.mapper';
import { ApiBaseService } from '@/shared/services/general/api-base.service';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { filterNullEntity } from '@/shared/utils/filter-null-entity.util';
import { OrderModel } from '../model/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private baseAPI: ApiBaseService,
    private mapper: Mapper
  ) {}

  createOrder(body: any): Observable<OrderModel> {
    return this.baseAPI
      .post(ApiConstant.CREATE_ORDER, filterNullEntity(body))
      .pipe(map((res) => this.mapper.fromJson(OrderModel, res.data)));
  }
}
