import {
  PaginationInputDto,
  PaginationOutputDto,
} from 'src/common/dto/pagination.dto';

export function calculatePagination(
  totalItems: number,
  paginationInput: PaginationInputDto,
): PaginationOutputDto {
  const { page, perPage } = paginationInput;
  const totalPages = Math.ceil(totalItems / perPage);

  return {
    totalItems: totalItems,
    currentPage: page,
    totalPages: totalPages,
    itemsPerPage: perPage,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
