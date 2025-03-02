import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    type: 'string',
    description: 'The ID of the entity being commented on',
  })
  @IsNotEmpty()
  @IsString()
  entityId: string;

  @ApiProperty({
    type: 'string',
    description: 'The content of the comment',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    type: 'string',
    description: 'The ID of the parent comment if this is a reply',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
