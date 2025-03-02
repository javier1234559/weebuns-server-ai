import { ReactionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '../../comment/entities/comment.entity';
import { User } from '../../user/entities/user.entity';

export class CommentReaction {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  commentId: string;
  @ApiProperty({
    type: 'string',
  })
  userId: string;
  @ApiProperty({
    enum: ReactionType,
    enumName: 'ReactionType',
  })
  type: ReactionType;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: () => Comment,
    required: false,
  })
  comment?: Comment;
  @ApiProperty({
    type: () => User,
    required: false,
  })
  user?: User;
}
