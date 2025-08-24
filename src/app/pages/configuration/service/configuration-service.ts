import { Mapper } from '@/shared/mapper/base-mapper.mapper';
import { ApiBaseService } from '@/shared/services/general/api-base.service';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Configuration } from '../model/configuration.model';
import { ApiConstant } from '@/shared/config/api.constant';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  constructor(
    private baseAPI: ApiBaseService,
    private mapper: Mapper
  ) {}

  getConfiguration(): Observable<Configuration> {
    return this.baseAPI
      .get(ApiConstant.GET_CONFIGURATION)
      .pipe(map((res) => this.mapper.fromJson(Configuration, res.data)));
  }

  updateConfiguration(data: Partial<Configuration>): Observable<Configuration> {
    return this.baseAPI
      .post(ApiConstant.UPDATE_CONFIGURATION, data)
      .pipe(map((res) => this.mapper.fromJson(Configuration, res.data)));
  }
}
