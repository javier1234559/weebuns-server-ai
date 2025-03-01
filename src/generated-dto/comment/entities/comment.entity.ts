import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { CommentReaction } from '../../comment-reaction/entities/comment-reaction.entity';

export class Comment {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  userId: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  parentId: string | null;
  @ApiProperty({
    type: 'string',
  })
  entityId: string;
  @ApiProperty({
    type: 'string',
  })
  content: string;
  @ApiProperty({
    type: 'boolean',
  })
  isEdited: boolean;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  deletedAt: Date | null;
  @ApiProperty({
    type: () => User,
    required: false,
  })
  user?: User;
  @ApiProperty({
    type: () => Comment,
    required: false,
    nullable: true,
  })
  parent?: Comment | null;
  @ApiProperty({
    type: () => Comment,
    isArray: true,
    required: false,
  })
  replies?: Comment[];
  @ApiProperty({
    type: () => CommentReaction,
    isArray: true,
    required: false,
  })
  reactions?: CommentReaction[];
}
