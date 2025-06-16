import { ApiProperty } from '@nestjs/swagger';
import { PaginationOutputDto } from 'src/common/dto/pagination.dto';
import { ReactionType, UserRole } from '@prisma/client';

export class CommentUserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  profilePicture: string;

  @ApiProperty({
    type: String,
    enum: UserRole,
  })
  role: UserRole;
}

export class CommentReactionResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: ReactionType })
  type: ReactionType;

  @ApiProperty()
  createdAt: Date;
}

export class CommentResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  identifierId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  parentId: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date | null;

  @ApiProperty()
  lessonSubmissionId: string | null;

  @ApiProperty()
  actionLink: string | null;

  @ApiProperty({ type: CommentUserResponse })
  user: CommentUserResponse;

  @ApiProperty({ type: [CommentReactionResponse] })
  reactions: CommentReactionResponse[];

  @ApiProperty({ type: Object })
  _count: {
    replies: number;
  };

  @ApiProperty()
  likesCount: number;

  @ApiProperty()
  lovesCount: number;

  @ApiProperty()
  hasReplies: boolean;

  @ApiProperty({
    type: String,
    enum: ReactionType,
    nullable: true,
  })
  userReaction: ReactionType | null;
}

export class CommentsResponse {
  @ApiProperty({ type: [CommentResponse] })
  data: CommentResponse[];

  @ApiProperty({ type: PaginationOutputDto })
  pagination: PaginationOutputDto;
}

export class CreateCommentResponse {
  @ApiProperty({ type: CommentResponse })
  comment: CommentResponse;
}

export class DeleteCommentResponse {
  @ApiProperty()
  message: string;
}

export class AddReactionResponse {
  @ApiProperty()
  message: string;
}
