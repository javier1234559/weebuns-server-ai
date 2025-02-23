import { CreateLessonDto } from 'src/lesson/dto/create-lesson.dto';
import { ListLessonQueryDto } from 'src/lesson/dto/list-lesson-query.dto';
import { PaginatedResponseDto } from 'src/lesson/dto/paginated-lesson-response.dto';
import { UpdateLessonDto } from 'src/lesson/dto/update-lesson.dto';
import { ILesson } from 'src/lesson/interface/lesson.interface';

export interface ILessonService {
  create(userId: string, createLessonDto: CreateLessonDto): Promise<ILesson>;
  findAll(query: ListLessonQueryDto): Promise<PaginatedResponseDto<ILesson>>;
  findOne(id: string): Promise<ILesson>;
  update(
    id: string,
    userId: string,
    updateLessonDto: UpdateLessonDto,
  ): Promise<ILesson>;
  remove(id: string, userId: string): Promise<void>;
  publish(id: string, userId: string): Promise<ILesson>;
}
