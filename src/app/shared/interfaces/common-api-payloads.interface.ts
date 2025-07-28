import { SortDirection } from '../enums/sort-direction.enum';

export interface IPagingPayload {
  offset?: number;
  limit?: number;
}

export interface ISortPayload {
  sortDirection?: SortDirection;
  sortField?: string;
}

export interface IFilterPayload {
  startFrom?: string;
  endAt?: string;
  searchTerm?: string;
  searchKey?: string;
  dateRangeType?: string;
}
