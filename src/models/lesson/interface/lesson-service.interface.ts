import { ILesson } from './lesson.interface';
import {
  CreateLessonDto,
  UpdateLessonDto,
  FindAllLessonsDto,
} from '../dto/lesson-request.dto';
import { SkillType } from '@prisma/client';

export interface ILessonService {
  findAll(params: FindAllLessonsDto): Promise<ILesson[]>;
  findById(id: string): Promise<ILesson>;
  createLesson(
    skillType: SkillType,
    dto: CreateLessonDto,
    userId: string,
  ): Promise<ILesson>;
  updateLesson(
    id: string,
    dto: UpdateLessonDto,
    userId: string,
  ): Promise<ILesson>;
  deleteLesson(id: string): Promise<void>;
}
