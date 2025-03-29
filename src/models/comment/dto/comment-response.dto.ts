import { ApiProperty } from '@nestjs/swagger';

import { PaginationOutputDto } from 'src/common/dto/pagination.dto';
import { Comment } from '../entities/comment.entity';

export class CommentResponse {
  @ApiProperty()
  comment: Comment;
}

export class CommentsResponse {
  @ApiProperty({ type: [Comment] })
  comments: Comment[];

  @ApiProperty({ type: PaginationOutputDto })
  pagination: PaginationOutputDto;
}

export class CreateCommentResponse {
  @ApiProperty({ type: Comment })
  comment: Comment;
}

export class UpdateCommentResponse {
  @ApiProperty({ type: Comment })
  comment: Comment;
}

export class DeleteCommentResponse {
  @ApiProperty({ type: Comment })
  comment: Comment;
}
