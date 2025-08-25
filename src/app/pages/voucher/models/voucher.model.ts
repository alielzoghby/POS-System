import { Pagination } from '@/shared/models/list';
import { Expose } from 'class-transformer';

export class Voucher {
  @Expose() voucher_id?: string;
  @Expose() voucher_refrence!: string;
  @Expose() percentage!: number;
  @Expose() amount!: number;
}

export class VoucherList {
  @Expose() vouchers!: Voucher[];
  @Expose()
  pagination?: Pagination;
}
