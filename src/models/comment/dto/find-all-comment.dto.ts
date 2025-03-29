import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import {
  PaginationInputDto,
  PaginationOutputDto,
} from 'src/common/dto/pagination.dto';
import { Comment } from '../entities/comment.entity';

@InputType()
export class FindAllCommentsDto extends PaginationInputDto {
  @Field()
  @ApiProperty()
  submissionId: string;
}

@ObjectType()
export class CommentsResponse {
  @Field(() => [Comment])
  @ApiProperty({ type: [Comment] })
  data: Comment[];

  @Field(() => PaginationOutputDto)
  @ApiProperty()
  pagination: PaginationOutputDto;
}
