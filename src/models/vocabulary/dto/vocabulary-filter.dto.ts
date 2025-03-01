import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class VocabularyFilterDto {
  @ApiProperty({
    type: 'string',
    isArray: true,
    required: false,
    description: 'Filter vocabularies by tags',
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    // Transform string to array if needed
    if (typeof value === 'string') {
      return value.split(',').map((tag) => tag.trim());
    }
    return value;
  })
  tags?: string[];

  @ApiProperty({
    type: 'string',
    required: false,
    description: 'Search vocabularies by term',
  })
  @IsOptional()
  @IsString()
  term?: string;
}
