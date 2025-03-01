import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { ReactionType } from '@prisma/client';

export class CommentReactionCommentIdUserIdTypeUniqueInputDto {
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
}

@ApiExtraModels(CommentReactionCommentIdUserIdTypeUniqueInputDto)
export class ConnectCommentReactionDto {
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  id?: string;
  @ApiProperty({
    type: CommentReactionCommentIdUserIdTypeUniqueInputDto,
    required: false,
    nullable: true,
  })
  commentId_userId_type?: CommentReactionCommentIdUserIdTypeUniqueInputDto;
}
