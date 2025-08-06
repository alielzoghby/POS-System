import { Expose } from 'class-transformer';

export class Pagination {
  @Expose()
  totalPages?: number;

  @Expose()
  totalDocuments?: number;

  @Expose()
  currentPage?: number;

  @Expose()
  limit?: number;

  @Expose()
  skip?: number;

  @Expose()
  hasNextPage?: boolean;

  @Expose()
  hasPrevPage?: boolean;

  @Expose()
  totalUsers?: number;
}
