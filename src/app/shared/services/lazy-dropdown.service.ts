import { Injectable } from '@angular/core';
import { ApiBaseService } from './general/api-base.service';
import { Mapper } from '../mapper/base-mapper.mapper';
import { map, Observable } from 'rxjs';
import { ApiConstant } from '../config/api.constant';
import { DropdownData, DropdownDataModel } from '../models/DropdownData.model';
import { filterNullEntity } from '../utils/filter-null-entity.util';

@Injectable({
  providedIn: 'root',
})
export class LazyDropdownService {
  constructor(
    private baseAPI: ApiBaseService,
    private mapper: Mapper
  ) {}

  getDropdownData(body: { type: string; params: any }): Observable<DropdownDataModel> {
    return this.baseAPI
      .get(ApiConstant.GET_LOOKUP.replace('{type}', body.type), {
        params: filterNullEntity(body.params),
      })
      .pipe(map((res) => this.mapper.fromJson(DropdownDataModel, res.data)));
  }
}
