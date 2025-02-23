import { ReactionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentReactionDto {
  @ApiProperty({
    enum: ReactionType,
    enumName: 'ReactionType',
    required: false,
  })
  type?: ReactionType;
}
