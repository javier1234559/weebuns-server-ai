import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { LessonType, Prisma, SkillType } from '@prisma/client';

export class CreateLessonDto {
  @ApiProperty({
    enum: {
      reading: 'reading',
      writing: 'writing',
      listening: 'listening',
      speaking: 'speaking',
    },
    enumName: 'SkillType',
    description: 'Skill type (value must match database enum exactly)',
  })
  @IsEnum(SkillType)
  @IsNotEmpty()
  skill: SkillType;

  @ApiProperty({ type: String, description: 'Title of the lesson' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: String,
    required: false,
    nullable: true,
    description: 'Description of the lesson',
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({
    enum: {
      practice: 'practice',
      test: 'test',
    },
    enumName: 'LessonType',
    description: 'Lesson type (value must match database enum exactly)',
  })
  @IsEnum(LessonType)
  @IsNotEmpty()
  lessonType: LessonType;

  @ApiProperty({ type: String, description: 'Topic of the lesson' })
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiProperty({
    type: Number,
    required: false,
    nullable: true,
    description: 'Time limit in minutes',
  })
  @IsOptional()
  timeLimit?: number | null;

  @ApiProperty({
    type: Object,
    required: false,
    nullable: true,
    description: 'Lesson content in JSON format',
  })
  @IsOptional()
  content?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;

  @ApiProperty({
    type: String,
    required: false,
    nullable: true,
    description: 'Thumbnail URL',
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string | null;

  @ApiProperty({
    type: String,
    description: 'Level code (e.g., BEGINNER)',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  level: string;

  @ApiProperty({
    type: String,
    description: 'Level type (e.g., level)',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  levelType: string;

  @ApiProperty({ type: [String], description: 'Tags for the lesson' })
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
