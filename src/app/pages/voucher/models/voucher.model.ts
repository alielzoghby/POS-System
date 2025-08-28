import { Pagination } from '@/shared/models/list';
import { Expose } from 'class-transformer';

export class Voucher {
  @Expose() voucher_id?: string;
  @Expose() voucher_reference!: string;
  @Expose() percentage!: number;
  @Expose() amount!: number;
  @Expose() active?: boolean;
  @Expose() expired_at?: Date;
  @Expose() multiple?: boolean;
}

export class VoucherList {
  @Expose() vouchers!: Voucher[];
  @Expose()
  pagination?: Pagination;
}
