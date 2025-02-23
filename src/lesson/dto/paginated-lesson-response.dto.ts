import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  items: T[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}
