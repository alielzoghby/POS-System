import { ApiConstant } from '@/shared/config/api.constant';
import { Mapper } from '@/shared/mapper/base-mapper.mapper';
import { ApiBaseService } from '@/shared/services/general/api-base.service';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from './../../helper/service/product.service';
import { ProductListModel, ProductModel } from '../models/product.model';
import { filterNullEntity } from '@/shared/utils/filter-null-entity.util';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private baseAPI: ApiBaseService,
    private mapper: Mapper
  ) {}

  getProduct(id: string): Observable<ProductModel> {
    return this.baseAPI
      .get(ApiConstant.GET_CATEGORY.replace('{id}', id))
      .pipe(map((res) => this.mapper.fromJson(ProductModel, res.data)));
  }

  getProducts(body: { page: number; limit: number; search: string }): Observable<ProductListModel> {
    return this.baseAPI
      .get(ApiConstant.GET_PRODUCT_LIST, { params: filterNullEntity(body) })
      .pipe(map((res) => this.mapper.fromJson(ProductListModel, res.data)));
  }

  addProduct(body: Product): Observable<ProductModel> {
    return this.baseAPI
      .post(ApiConstant.ADD_PRODUCT, filterNullEntity(body))
      .pipe(map((res) => this.mapper.fromJson(ProductModel, res.data)));
  }

  updateProduct(id: string, body: Product): Observable<ProductModel> {
    return this.baseAPI
      .patch(ApiConstant.UPDATE_PRODUCT.replace('{id}', id), filterNullEntity(body))
      .pipe(map((res) => this.mapper.fromJson(ProductModel, res.data)));
  }

  deleteProduct(ids: string[]): Observable<ProductModel> {
    return this.baseAPI
      .delete(ApiConstant.DELETE_PRODUCT, { body: { ids } })
      .pipe(map((res) => this.mapper.fromJson(ProductModel, res.data)));
  }

  createSubProduct(body: { unit_value: number; reference: string }): Observable<ProductModel> {
    return this.baseAPI
      .post(ApiConstant.CREATE_SUB_PRODUCT, filterNullEntity(body))
      .pipe(map((res) => this.mapper.fromJson(ProductModel, res.data)));
  }
}
