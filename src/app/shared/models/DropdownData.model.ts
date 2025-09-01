import { Expose } from 'class-transformer';
import { Pagination } from '@/shared/models/list';

export class DropdownData {
  @Expose() label?: string;
  @Expose() value?: string;
}

export class DropdownDataModel {
  @Expose() data?: DropdownData[];
  @Expose() pagination?: Pagination;
}
