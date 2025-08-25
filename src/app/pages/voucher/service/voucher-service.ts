import { ApiConstant } from '@/shared/config/api.constant';
import { Mapper } from '@/shared/mapper/base-mapper.mapper';
import { ApiBaseService } from '@/shared/services/general/api-base.service';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Voucher, VoucherList } from '../models/voucher.model';
import { filterNullEntity } from '@/shared/utils/filter-null-entity.util';

@Injectable({
  providedIn: 'root',
})
export class VoucherService {
  constructor(
    private baseAPI: ApiBaseService,
    private mapper: Mapper
  ) {}

  getVouchers(body?: { page: number; limit: number; search: string }): Observable<VoucherList> {
    return this.baseAPI
      .get(ApiConstant.GET_VOUCHERS, { params: body })
      .pipe(map((res) => this.mapper.fromJson(VoucherList, res.data)));
  }

  createVoucher(data: Partial<Voucher>): Observable<Voucher> {
    return this.baseAPI
      .post(ApiConstant.CREATE_VOUCHER, filterNullEntity(data))
      .pipe(map((res) => this.mapper.fromJson(Voucher, res.data)));
  }

  updateVoucher(id: string, data: Partial<Voucher>): Observable<Voucher> {
    return this.baseAPI
      .put(ApiConstant.UPDATE_VOUCHER.replace('{id}', id), filterNullEntity(data))
      .pipe(map((res) => this.mapper.fromJson(Voucher, res.data)));
  }

  deleteVoucher(id: string): Observable<void> {
    return this.baseAPI.delete(ApiConstant.DELETE_VOUCHER.replace('{id}', id)).pipe(map(() => {}));
  }
}
