import { ContentStatus, LessonType, SkillType } from '@prisma/client';

export interface ILessonWhere {
  deletedAt: Date | null;
  OR?: Array<{
    title?: { contains: string; mode: 'insensitive' };
    description?: { contains: string; mode: 'insensitive' };
  }>;
  skill?: SkillType | undefined;
  lessonType?: LessonType | undefined;
  status?: ContentStatus | undefined;
  level?: string | undefined;
  topic?: string | undefined;
}
