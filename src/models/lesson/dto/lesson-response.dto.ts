import { ApiProperty } from '@nestjs/swagger';
import { ContentStatus, LessonType, Prisma, SkillType } from '@prisma/client';

export class ResponseLessonDto {
  @ApiProperty({ type: String, description: 'Lesson ID' })
  id: string;

  @ApiProperty({ enum: SkillType, enumName: 'SkillType' })
  skill: SkillType;

  @ApiProperty({ type: String, description: 'Title of the lesson' })
  title: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Description of the lesson',
  })
  description: string | null;

  @ApiProperty({ enum: LessonType, enumName: 'LessonType' })
  lessonType: LessonType;

  @ApiProperty({ type: String, description: 'Topic of the lesson' })
  topic: string;

  @ApiProperty({
    type: Number,
    nullable: true,
    description: 'Time limit in minutes',
  })
  timeLimit: number | null;

  @ApiProperty({
    type: Object,
    nullable: true,
    description: 'Lesson content in JSON format',
  })
  content: Prisma.JsonValue | null;

  @ApiProperty({ type: [String], description: 'Tags for the lesson' })
  tags: string[];

  @ApiProperty({ type: String, nullable: true, description: 'Thumbnail URL' })
  thumbnailUrl: string | null;

  @ApiProperty({
    enum: ContentStatus,
    enumName: 'ContentStatus',
    description: 'Status of the lesson',
  })
  status: ContentStatus;

  @ApiProperty({
    type: String,
    description: 'ID of the user who created the lesson',
  })
  createdById: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}
