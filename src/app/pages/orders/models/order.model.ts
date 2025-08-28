import { ProductModel } from '@/pages/products/models/product.model';
import { User } from '@/shared/models/user.model';
import { Expose } from 'class-transformer';
import { PaidStatus } from '../enums/paid_status.enum';
import { Voucher } from '@/pages/voucher/models/voucher.model';
import { Pagination } from './../../../shared/models/list';

export class Order {
  @Expose()
  order_id?: number;

  @Expose()
  client_id?: number;

  @Expose()
  reference?: string;

  @Expose()
  total_price?: number;

  @Expose()
  tip?: number;

  @Expose()
  payment_method?: string;

  @Expose()
  voucher_reference?: string | null;

  @Expose()
  voucher?: Voucher;

  @Expose()
  payment_reference?: string | null;

  @Expose()
  discounted?: number;

  @Expose()
  created_at?: Date;

  @Expose()
  created_by?: User;

  @Expose() paid?: number;

  @Expose() tax?: number;

  @Expose() sub_total?: number;

  @Expose()
  due?: number;

  @Expose()
  paid_status?: PaidStatus;

  @Expose()
  client?: {
    client_id: number;
    first_name: string;
    last_name: string;
    email: string;
    company: string | null;
  };

  @Expose()
  productOrders?: Array<{
    product_id: number;
    order_id: number;
    quantity: number;
    price: number;
    product: Pick<ProductModel, 'product_id' | 'name' | 'reference'>;
  }>;
}

export class OrderAnalysis {
  @Expose() totalSubTotal!: number;
  @Expose() totalDue!: number;
  @Expose() totalTip!: number;
  @Expose() totalTaxAmount!: number;
  @Expose() totalTotalPrice!: number;
  @Expose() totalDiscounted!: number;
}

export class OrderList {
  @Expose() orders!: Order[];
  @Expose() pagination!: Pagination;
  @Expose() analysis!: OrderAnalysis;
}
