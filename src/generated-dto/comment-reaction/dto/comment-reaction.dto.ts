import { ReactionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CommentReactionDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
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
}
