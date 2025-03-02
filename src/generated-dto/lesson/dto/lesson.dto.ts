import { ContentStatus, LessonType, Prisma, SkillType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class LessonDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    enum: SkillType,
    enumName: 'SkillType',
  })
  skill: SkillType;
  @ApiProperty({
    type: 'string',
  })
  title: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  description: string | null;
  @ApiProperty({
    enum: LessonType,
    enumName: 'LessonType',
  })
  lessonType: LessonType;
  @ApiProperty({
    type: 'string',
  })
  topic: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    nullable: true,
  })
  timeLimit: number | null;
  @ApiProperty({
    type: () => Object,
    nullable: true,
  })
  content: Prisma.JsonValue | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  thumbnailUrl: string | null;
  @ApiProperty({
    enum: ContentStatus,
    enumName: 'ContentStatus',
  })
  status: ContentStatus;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  deletedAt: Date | null;
}
