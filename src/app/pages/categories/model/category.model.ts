import { ProductModel } from '@/pages/products/models/product.model';
import { Pagination } from '@/shared/models/list';
import { Expose } from 'class-transformer';

export class CategoryModel {
  @Expose()
  category_id!: string;
  @Expose() name!: string;
  @Expose() products!: ProductModel[];
  @Expose() created_at!: Date;
}

export class CategoryListModel {
  @Expose()
  categories!: CategoryModel[];
  @Expose()
  pagination!: Pagination;
}
