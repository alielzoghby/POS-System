import { ProductModel } from '@/pages/products/models/product.model';
import { Expose } from 'class-transformer';

export class OrderModel {
  @Expose()
  client_id!: number;

  @Expose()
  reference!: string;

  @Expose()
  products!: ProductModel[];
}
