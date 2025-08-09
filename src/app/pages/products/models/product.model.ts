import { Expose } from 'class-transformer';
import { CategoryModel } from './../../categories/model/category.model';
import { Pagination } from '@/shared/models/list';

export enum ProductStatus {
  InStock = 'IN_STOCK',
  LowStock = 'LOW_STOCK',
  OutOfStock = 'OUT_OF_STOCK',
}

export class ProductModel {
  @Expose()
  product_id?: string;

  @Expose()
  image?: string;

  @Expose()
  name?: string;

  @Expose()
  reference?: string;

  @Expose()
  lot?: string;

  @Expose()
  category?: CategoryModel;

  @Expose()
  category_id?: CategoryModel;

  @Expose()
  base_price?: number;

  @Expose()
  final_price?: number;

  @Expose()
  quantity?: number;

  @Expose()
  status?: ProductStatus;

  @Expose()
  expiration_date?: string;

  @Expose()
  price?: number;
}

export class ProductListModel {
  @Expose()
  products?: ProductModel[];

  @Expose()
  pagination?: Pagination;
}
