import { ReactionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentReactionDto {
  @ApiProperty({
    enum: ReactionType,
    enumName: 'ReactionType',
  })
  type: ReactionType;
}
