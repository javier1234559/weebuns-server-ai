import { ApiProperty } from '@nestjs/swagger';
import { ContentStatus, LessonType, Prisma, SkillType } from '@prisma/client';
import { ILesson } from 'src/lesson/interface/lesson.interface';

export class LessonResponseDto implements ILesson {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: SkillType })
  skill: SkillType;

  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty({ enum: LessonType })
  lessonType: LessonType;

  @ApiProperty()
  level: string;

  @ApiProperty()
  levelType: string;

  @ApiProperty()
  topic: string;

  @ApiProperty({ nullable: true })
  timeLimit: number | null;

  @ApiProperty({ nullable: true })
  content: Prisma.JsonValue | string | null;

  @ApiProperty({ enum: ContentStatus })
  status: ContentStatus;

  @ApiProperty()
  createdById: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  deletedAt: Date | null;

  constructor(lesson: ILesson) {
    Object.assign(this, lesson);
  }
}
