import { ContentStatus, LessonType, Prisma, SkillType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

import { ILesson } from 'src/models/lesson/interface/lesson.interface';
import { User } from 'src/models/user/entities/user.entity';
import { LessonSubmission } from 'src/models/lesson-submission/entities/lesson-submission.entity';
import { ReferenceData } from 'src/models/reference-data/entities/reference-data.entity';

export class Lesson implements ILesson {
  @ApiProperty()
  id: string;

  @ApiProperty({
    enum: SkillType,
    enumName: 'SkillType',
  })
  skill: SkillType;

  @ApiProperty()
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

  @ApiProperty()
  level: string;

  @ApiProperty()
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
    isArray: true,
  })
  tags: string[];

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
  })
  createdById: string;

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

  @ApiProperty({
    type: () => User,
    required: false,
  })
  createdBy?: User;

  @ApiProperty({
    type: () => LessonSubmission,
    isArray: true,
    required: false,
  })
  submissions?: LessonSubmission[];

  @ApiProperty({
    type: () => ReferenceData,
    required: false,
  })
  levelRef?: ReferenceData;
}
