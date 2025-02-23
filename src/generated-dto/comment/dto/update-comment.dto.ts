import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({
    type: 'string',
    required: false,
  })
  entityId?: string;
  @ApiProperty({
    type: 'string',
    required: false,
  })
  content?: string;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true,
  })
  deletedAt?: Date | null;
}
