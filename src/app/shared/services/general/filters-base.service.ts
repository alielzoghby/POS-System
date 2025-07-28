import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import moment from 'moment';
import {
  IFilterPayload,
  IPagingPayload,
  ISortPayload,
} from '../../interfaces/common-api-payloads.interface';
import { ConfigConstant } from '../../config/config.constant';
import { SortDirection } from '../../enums/sort-direction.enum';

export type FiltersBaseParams = IPagingPayload & ISortPayload & IFilterPayload;

type FilterBaseParam = IPagingPayload | ISortPayload | IFilterPayload;

@Injectable({ providedIn: 'root' })
export class FiltersBase<T = {}, D = {}> {
  private pagination: IPagingPayload = {
    offset: ConfigConstant.INIT_PAGE_OFFSET,
    limit: ConfigConstant.PAGE_SIZE,
  };
  private sort: ISortPayload = { sortDirection: SortDirection.None, sortField: '' };
  private search: IFilterPayload = {
    dateRangeType: '',
    searchTerm: '',
    startFrom: '',
    endAt: '',
  };
  public fields: T = {} as T;
  public displays: D = {} as D;

  private dataDomain = new BehaviorSubject(this.params);

  public data$ = this.dataDomain.asObservable();

  constructor() {}

  get params(): FiltersBaseParams & T {
    return {
      ...this.pagination,
      ...this.sort,
      ...this.search,
      ...this.fields,
    };
  }

  set params(filterParams: FiltersBaseParams & T) {
    this.pagination = {
      ...this.pagination,
      ...this.getParamsOfRelevantObj(this.pagination, filterParams),
    };
    this.sort = { ...this.sort, ...this.getParamsOfRelevantObj(this.sort, filterParams) };
    this.search = { ...this.search, ...this.getParamsOfRelevantObj(this.search, filterParams) };
    this.fields = { ...this.fields, ...this.getParamsOfRelevantObj(this.fields, filterParams) };
    this.dataDomain.next(this.params);
  }

  get sourceOfAllParams(): FiltersBaseParams & T & D {
    const fields = { ...this.params, ...this.displays };
    return Object.keys(fields).reduce(
      (group, key) => {
        const typedKey = key as keyof FiltersBaseParams & keyof T & keyof D;

        if (fields[typedKey] === null) {
          group[typedKey] = ConfigConstant.ALL as any;
        } else {
          group[typedKey] = fields[typedKey] as any;
        }
        return group;
      },
      {} as FiltersBaseParams & T & D
    );
  }

  set display(displaySet: D) {
    this.displays = { ...this.displays, ...this.getParamsOfRelevantObj(this.displays, displaySet) };
  }

  static parseValue(value: any): any {
    if (typeof value === 'string' && value.toLowerCase() === 'true') {
      return true;
    }

    if (typeof value === 'string' && value.toLowerCase() === 'false') {
      return false;
    }

    if (typeof value === 'string' && value !== '' && Number(value) === Number(value)) {
      return Number(value);
    }

    if (typeof value === 'string' && value !== '' && moment(value).isValid()) {
      return value;
    }

    return value;
  }

  private getParamsOfRelevantObj(obj: any, params: any): Partial<FilterBaseParam | T | D> {
    const newValue: any = {};
    Object.keys(obj).forEach((key) => {
      if (typeof params[key] !== 'undefined') {
        newValue[key] =
          params[key] === ConfigConstant.ALL ? null : FiltersBase.parseValue(params[key]);
      }
    });
    return newValue;
  }

  resetToDefault(): void {
    this.search = { dateRangeType: '', searchTerm: '', startFrom: '', endAt: '' };
    this.pagination = { offset: ConfigConstant.INIT_PAGE_OFFSET, limit: ConfigConstant.PAGE_SIZE };
    this.sort = { sortDirection: SortDirection.None, sortField: '' };
  }
}
