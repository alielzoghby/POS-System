import { ProductModel } from '@/pages/products/models/product.model';
import { User } from '@/shared/models/user.model';
import { Expose } from 'class-transformer';
import { PaidStatus } from '../enums/paid_status.enum';

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
  payment_reference?: string | null;

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
