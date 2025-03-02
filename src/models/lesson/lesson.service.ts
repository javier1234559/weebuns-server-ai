import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContentStatus, Prisma } from '@prisma/client';
import { UserRole } from 'src/common/decorators/role.decorator';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateLessonDto } from 'src/models/lesson/dto/create-lesson.dto';

import { ListLessonQueryDto } from 'src/models/lesson/dto/list-lesson-query.dto';
import { PaginatedResponseDto } from 'src/models/lesson/dto/paginated-lesson-response.dto';
import { UpdateLessonDto } from 'src/models/lesson/dto/update-lesson.dto';
import { ILessonService } from 'src/models/lesson/interface/lesson-service.interface';
import { ILesson } from 'src/models/lesson/interface/lesson.interface';

@Injectable()
export class LessonService implements ILessonService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createLessonDto: CreateLessonDto,
  ): Promise<ILesson> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.TEACHER && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Only teachers and admins can create lessons',
      );
    }

    return this.prisma.lesson.create({
      data: {
        ...createLessonDto,
        createdById: userId,
        level: 'A1',
        levelType: 'beginner',
        status: ContentStatus.draft,
      },
    });
  }

  async findAll(
    query: ListLessonQueryDto,
  ): Promise<PaginatedResponseDto<ILesson>> {
    const where: Prisma.LessonWhereInput = {
      deletedAt: null,
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
        ],
      }),
      ...(query.skill && { skill: query.skill }),
      ...(query.lessonType && { lessonType: query.lessonType }),
      ...(query.status && { status: query.status }),
      ...(query.level && { level: query.level }),
      ...(query.topic && { topic: query.topic }),
    };

    const [total, items] = await Promise.all([
      this.prisma.lesson.count({ where }),
      this.prisma.lesson.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
    ]);

    return {
      total,
      items,
      page: 1,
      limit: items.length,
    };
  }

  async findOne(id: string): Promise<ILesson> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!lesson || lesson.deletedAt) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async update(
    id: string,
    userId: string,
    updateLessonDto: UpdateLessonDto,
  ): Promise<ILesson> {
    const lesson = await this.findOne(id);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.role) {
      throw new ForbiddenException('User role not found');
    }

    if (lesson.createdById !== userId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own lessons');
    }

    return this.prisma.lesson.update({
      where: { id },
      data: updateLessonDto,
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    const lesson = await this.findOne(id);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.role) {
      throw new ForbiddenException('User role not found');
    }

    if (lesson.createdById !== userId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own lessons');
    }

    await this.prisma.lesson.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async publish(id: string, userId: string): Promise<ILesson> {
    const lesson = await this.findOne(id);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (lesson.createdById !== userId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only publish your own lessons');
    }

    if (lesson.status !== ContentStatus.draft) {
      throw new ForbiddenException(
        'Chỉ có thể publish bài học ở trạng thái draft',
      );
    }

    return this.prisma.lesson.update({
      where: { id },
      data: { status: ContentStatus.published },
    });
  }
}
