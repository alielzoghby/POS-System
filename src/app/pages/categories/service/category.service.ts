import { ApiConstant } from '@/shared/config/api.constant';
import { Mapper } from '@/shared/mapper/base-mapper.mapper';
import { ApiBaseService } from '@/shared/services/general/api-base.service';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CategoryListModel, CategoryModel } from '../model/category.model';
import { P } from 'node_modules/@angular/cdk/portal-directives.d-DbeNrI5D';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(
    private baseAPI: ApiBaseService,
    private mapper: Mapper
  ) {}

  getCategory(id: string): Observable<CategoryModel> {
    return this.baseAPI
      .get(ApiConstant.GET_CATEGORY.replace('{id}', id))
      .pipe(map((res) => this.mapper.fromJson(CategoryModel, res.data)));
  }
  getCategoryList(): Observable<CategoryListModel> {
    return this.baseAPI
      .get(ApiConstant.GET_CATEGORY_LIST, { params: { limit: 100, page: 1 } })
      .pipe(map((res) => this.mapper.fromJson(CategoryListModel, res.data)));
  }

  addCategory(body: { name: string }): Observable<CategoryModel> {
    return this.baseAPI
      .post(ApiConstant.ADD_CATEGORY, body)
      .pipe(map((res) => this.mapper.fromJson(CategoryModel, res.data)));
  }

  updateCategory(id: string, body: { id: string; name: string }): Observable<CategoryModel> {
    return this.baseAPI
      .put(ApiConstant.UPDATE_CATEGORY.replace('{id}', id), body)
      .pipe(map((res) => this.mapper.fromJson(CategoryModel, res.data)));
  }

  deleteCategory(id: string): Observable<CategoryModel> {
    return this.baseAPI
      .delete(ApiConstant.DELETE_CATEGORY.replace('{id}', id))
      .pipe(map((res) => this.mapper.fromJson(CategoryModel, res.data)));
  }
}
