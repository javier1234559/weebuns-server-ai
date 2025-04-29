import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationInputDto } from 'src/common/dto/pagination.dto';

export class CreateCommentDto {
  @ApiProperty({
    description:
      'Identifier to group comments (e.g. writing-all, writing-detail-123)',
  })
  @IsString()
  @IsNotEmpty()
  identifierId: string;

  @ApiProperty({
    description: 'Content of the comment',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'Parent comment ID if this is a reply',
  })
  @IsOptional()
  @IsString()
  parentId?: string;
}

export class FindAllCommentsDto extends PaginationInputDto {
  @ApiProperty({
    description:
      'Identifier to filter comments (e.g. writing-all, writing-detail-123)',
  })
  @IsString()
  @IsNotEmpty()
  identifierId: string;
}

export class AddReactionDto {
  @ApiProperty({
    description: 'Type of reaction (like, teacher_heart)',
    enum: ['like', 'teacher_heart'],
  })
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class FindRepliesDto extends PaginationInputDto {
  @ApiProperty({
    description: 'Comment ID to get replies for',
  })
  @IsString()
  @IsNotEmpty()
  commentId: string;
}
