export class PaginationResultDto<T> {
  data: T[];
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  nextPage: boolean;
  previousPage: boolean;

  constructor(partial: Partial<PaginationResultDto<T>>) {
    Object.assign(this, partial);
  }
}
