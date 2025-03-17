import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { ResponseLessonDto } from './dto/lesson-response.dto';
import { UserRole } from 'src/common/decorators/role.decorator';
import { LessonServiceInterface } from './interface/lesson-service.interface';
import { QueryLessonDto } from './dto/query-lesson.dto';
import { PaginatedLessonsResponseDto } from './dto/paginated-lessons-response.dto';
import { ContentStatus, LessonType, Prisma, SkillType } from '@prisma/client';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonService implements LessonServiceInterface {
  constructor(private readonly prisma: PrismaService) {}

  async createLesson(
    userId: string,
    userRole: UserRole,
    dto: CreateLessonDto,
  ): Promise<ResponseLessonDto> {
    if (userRole !== UserRole.ADMIN && userRole !== UserRole.TEACHER) {
      throw new ForbiddenException(
        'You do not have permission to create a lesson',
      );
    }

    const lesson = await this.prisma.lesson.create({
      data: {
        ...dto,
        createdById: userId,
      },
    });

    return lesson;
  }

  async getLessons(
    userId: string,
    userRole: UserRole,
    queryDto: QueryLessonDto,
  ): Promise<PaginatedLessonsResponseDto> {
    try {
      console.log(
        'Getting lessons with query params:',
        JSON.stringify(queryDto),
      );

      const { page = 1, limit = 10, ...filters } = queryDto;
      const skip = (page - 1) * limit;

      // Build filter conditions
      const where: Prisma.LessonWhereInput = {};

      if (filters.skill) {
        console.log(`Filtering by skill: ${filters.skill}`);
        // Handle skill as a string
        where.skill = filters.skill as SkillType;
      }

      if (filters.lessonType) {
        console.log(`Filtering by lessonType: ${filters.lessonType}`);
        // Handle lessonType as a string
        where.lessonType = filters.lessonType as LessonType;
      }

      if (filters.topic) {
        where.topic = filters.topic;
      }

      if (filters.title) {
        where.title = {
          contains: filters.title,
          mode: 'insensitive',
        };
      }

      if (filters.level) {
        where.level = filters.level;
      }

      if (filters.createdById) {
        where.createdById = filters.createdById;
      }

      // Handle tag filtering
      if (filters.tags && Array.isArray(filters.tags)) {
        where.tags = {
          hasSome: filters.tags,
        };
      }

      // Apply status filtering with role-based restrictions
      if (filters.status) {
        console.log(`Filtering by status: ${filters.status}`);
        // Handle status as a string
        where.status = filters.status as ContentStatus;
      } else {
        // If no specific status is requested, apply role-based visibility rules
        if (userRole === UserRole.ADMIN) {
          // Admins can see all lessons except deleted ones
          where.status = {
            not: ContentStatus.deleted,
          };
        } else if (userRole === UserRole.TEACHER) {
          // Teachers can see all published and their own drafts
          where.OR = [
            { status: ContentStatus.published },
            { status: ContentStatus.draft, createdById: userId },
            { status: ContentStatus.private, createdById: userId },
          ];
        } else {
          // Regular users can only see published lessons
          where.status = ContentStatus.published;
        }
      }

      console.log('Final query where clause:', JSON.stringify(where));

      // Execute count and query in parallel
      const [total, lessons] = await Promise.all([
        this.prisma.lesson.count({ where }),
        this.prisma.lesson.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: lessons,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      console.error('Error in getLessons service method:', error);
      throw error;
    }
  }

  async getLessonById(
    lessonId: string,
    userId: string,
    userRole: UserRole,
  ): Promise<ResponseLessonDto> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${lessonId} not found`);
    }

    // Apply visibility restrictions based on user role
    const canAccess =
      userRole === UserRole.ADMIN ||
      (userRole === UserRole.TEACHER &&
        (lesson.status === ContentStatus.published ||
          lesson.createdById === userId)) ||
      (userRole === UserRole.USER && lesson.status === ContentStatus.published);

    if (!canAccess) {
      throw new ForbiddenException(
        'You do not have permission to access this lesson',
      );
    }

    return lesson;
  }

  async updateLesson(
    lessonId: string,
    userId: string,
    userRole: UserRole,
    dto: UpdateLessonDto,
  ): Promise<ResponseLessonDto> {
    // First, check if lesson exists
    const existingLesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!existingLesson) {
      throw new NotFoundException(`Lesson with ID ${lessonId} not found`);
    }

    // Check permission
    const canEdit =
      userRole === UserRole.ADMIN ||
      (userRole === UserRole.TEACHER && existingLesson.createdById === userId);

    if (!canEdit) {
      throw new ForbiddenException(
        'You do not have permission to edit this lesson',
      );
    }

    // Update the lesson
    const updatedLesson = await this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        ...dto,
      },
    });

    return updatedLesson;
  }

  async deleteLesson(
    lessonId: string,
    userId: string,
    userRole: UserRole,
  ): Promise<ResponseLessonDto> {
    // First, check if lesson exists
    const existingLesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!existingLesson) {
      throw new NotFoundException(`Lesson with ID ${lessonId} not found`);
    }

    // Check permission
    const canDelete =
      userRole === UserRole.ADMIN ||
      (userRole === UserRole.TEACHER && existingLesson.createdById === userId);

    if (!canDelete) {
      throw new ForbiddenException(
        'You do not have permission to delete this lesson',
      );
    }

    // Soft delete by changing status to deleted
    const deletedLesson = await this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        status: ContentStatus.deleted,
      },
    });

    return deletedLesson;
  }
}
