import { ApiProperty } from '@nestjs/swagger';
import { ReactionType } from '@prisma/client';
import { ICommentReaction } from 'src/models/comment/interface/comment.interface';

export class CommentReaction implements ICommentReaction {
  @ApiProperty()
  id: string;

  @ApiProperty()
  commentId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({
    type: String,
    enum: ReactionType,
  })
  type: ReactionType;

  @ApiProperty()
  createdAt: Date;
}
