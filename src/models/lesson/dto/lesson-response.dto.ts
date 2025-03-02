import { ApiProperty } from '@nestjs/swagger';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationOutputDto } from 'src/common/dto/pagination.dto';
import { Lesson } from 'src/models/lesson/entities/lesson.entity';

@ObjectType()
export class LessonResponseDto {
  @Field(() => [Lesson])
  @ApiProperty({ type: Lesson })
  data: Lesson[];

  @Field(() => PaginationOutputDto, { nullable: true })
  @ApiProperty({ required: false })
  pagination?: PaginationOutputDto;

  constructor(data: Lesson[], pagination?: PaginationOutputDto) {
    this.data = data;
    this.pagination = pagination;
  }
}
