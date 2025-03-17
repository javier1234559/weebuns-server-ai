import { ApiProperty } from '@nestjs/swagger';
import { ResponseLessonDto } from './lesson-response.dto';

export class PaginatedLessonsResponseDto {
  @ApiProperty({
    type: [ResponseLessonDto],
    description: 'Array of lessons',
  })
  data: ResponseLessonDto[];

  @ApiProperty({
    type: Number,
    description: 'Total number of lessons matching the query',
  })
  total: number;

  @ApiProperty({
    type: Number,
    description: 'Current page number',
  })
  page: number;

  @ApiProperty({
    type: Number,
    description: 'Number of items per page',
  })
  limit: number;

  @ApiProperty({
    type: Number,
    description: 'Total number of pages',
  })
  totalPages: number;
}
