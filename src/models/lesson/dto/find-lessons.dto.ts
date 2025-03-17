import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ContentStatus, SkillType } from '@prisma/client';

export class FindLessonsDto {
  @ApiPropertyOptional({
    description: 'Search keyword for title, description, or tags',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: SkillType, enumName: 'SkillType' })
  @IsOptional()
  @IsEnum(SkillType)
  skill?: SkillType;

  @ApiPropertyOptional({ enum: ContentStatus, enumName: 'ContentStatus' })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}
