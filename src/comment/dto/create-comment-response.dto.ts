import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '@prisma/client';

export class CreateCommentResponseDto {
  @ApiProperty({
    description: 'The created comment',
  })
  comment: Comment;
}

