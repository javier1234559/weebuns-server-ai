import { UserRole } from 'src/common/decorators/role.decorator';
import { CreateLessonDto } from 'src/models/lesson/dto/create-lesson.dto';
import { PaginatedLessonsResponseDto } from 'src/models/lesson/dto/paginated-lessons-response.dto';
import { QueryLessonDto } from 'src/models/lesson/dto/query-lesson.dto';
import { ResponseLessonDto } from 'src/models/lesson/dto/lesson-response.dto';
import { UpdateLessonDto } from 'src/models/lesson/dto/update-lesson.dto';

export interface LessonServiceInterface {
  createLesson(
    userId: string,
    userRole: UserRole,
    dto: CreateLessonDto,
  ): Promise<ResponseLessonDto>;

  getLessons(
    userId: string,
    userRole: UserRole,
    queryDto: QueryLessonDto,
  ): Promise<PaginatedLessonsResponseDto>;

  getLessonById(
    lessonId: string,
    userId: string,
    userRole: UserRole,
  ): Promise<ResponseLessonDto>;

  updateLesson(
    lessonId: string,
    userId: string,
    userRole: UserRole,
    dto: UpdateLessonDto,
  ): Promise<ResponseLessonDto>;

  deleteLesson(
    lessonId: string,
    userId: string,
    userRole: UserRole,
  ): Promise<ResponseLessonDto>;
}
