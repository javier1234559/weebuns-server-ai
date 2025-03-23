import { CreateLessonDto } from 'src/models/lesson/dto/create-lesson.dto';
import { SkillType } from './lesson.interface';
import {
  FindAllLessonsDto,
  UpdateLessonDto,
} from 'src/models/lesson/dto/lesson-request.dto';

export interface ILessonService {
  findAll(params: FindAllLessonsDto): Promise<LessonResponseDto[]>;
  findById(id: string, skillType: SkillType): Promise<LessonResponseDto>;
  create(
    skillType: SkillType,
    data: CreateLessonDto,
    userId: string,
  ): Promise<LessonResponseDto>;
  update(
    id: string,
    skillType: SkillType,
    data: UpdateLessonDto,
    userId: string,
  ): Promise<LessonResponseDto>;
  delete(id: string, skillType: SkillType): Promise<void>;
}
