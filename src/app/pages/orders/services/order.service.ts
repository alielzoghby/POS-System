import { ApiConstant } from '@/shared/config/api.constant';
import { Mapper } from '@/shared/mapper/base-mapper.mapper';
import { ApiBaseService } from '@/shared/services/general/api-base.service';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { filterNullEntity } from '@/shared/utils/filter-null-entity.util';
import { Order, OrderList } from '@/pages/orders/models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private baseAPI: ApiBaseService,
    private mapper: Mapper
  ) {}

  createOrder(body: Order): Observable<Order> {
    return this.baseAPI
      .post(ApiConstant.CREATE_ORDER, filterNullEntity(body))
      .pipe(map((res) => this.mapper.fromJson(Order, res.data)));
  }

  getOrder(orderId: number): Observable<Order> {
    return this.baseAPI
      .get(`${ApiConstant.GET_ORDER}/${orderId}`)
      .pipe(map((res) => this.mapper.fromJson(Order, res.data)));
  }

  getOrders(body: {
    page: number;
    limit: number;
    search?: string;
    startDate?: Date;
    endDate?: Date;
    client_id?: number;
  }): Observable<OrderList> {
    return this.baseAPI
      .get(ApiConstant.GET_ORDERS, {
        params: {
          ...filterNullEntity(body),
        },
      })
      .pipe(map((res) => this.mapper.fromJson(OrderList, res.data)));
  }

  updateOrder(orderId: number, body: Order): Observable<Order> {
    return this.baseAPI
      .put(ApiConstant.UPDATE_ORDER.replace('{id}', String(orderId)), filterNullEntity(body))
      .pipe(map((res) => this.mapper.fromJson(Order, res.data)));
  }

  deleteOrder(orderId: number): Observable<void> {
    return this.baseAPI
      .delete(ApiConstant.DELETE_ORDER.replace('{id}', String(orderId)))
      .pipe(map(() => {}));
  }
}
