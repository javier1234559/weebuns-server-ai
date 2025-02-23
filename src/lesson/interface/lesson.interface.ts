import { ContentStatus, LessonType, SkillType } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export interface ILesson {
  id: string;
  skill: SkillType;
  title: string;
  description?: string | null;
  lessonType: LessonType;
  level: string;
  levelType: string;
  topic: string;
  timeLimit?: number | null;
  content: JsonValue | string | null | undefined;
  status: ContentStatus;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
