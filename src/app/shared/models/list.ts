import { Expose } from 'class-transformer';

export class Pagination {
  @Expose()
  totalPages?: number;

  @Expose()
  itemsPerPage?: number;

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
  totalDocuments?: number;
}
