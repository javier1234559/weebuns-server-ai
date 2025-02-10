import { PaginationOutputDto } from 'src/common/dto/pagination.dto';

export interface IPaginatedResult<T> {
  data: T[];
  pagination: PaginationOutputDto;
}
