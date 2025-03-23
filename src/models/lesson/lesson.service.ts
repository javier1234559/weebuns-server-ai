import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  CreateLessonDto,
  UpdateLessonDto,
  FindAllLessonsDto,
} from './dto/lesson-request.dto';
import { ContentStatus, SkillType } from '@prisma/client';
import { ILessonService } from './interface/lesson-service.interface';
import { ILesson } from './interface/lesson.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class LessonService implements ILessonService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: FindAllLessonsDto): Promise<ILesson[]> {
    const { skill, level, search } = params;

    const where: Prisma.LessonWhereInput = {
      deletedAt: null,
    };

    // Add filters only if they are provided
    if (skill) {
      where.skill = skill.toLowerCase() as SkillType;
    }

    if (level) {
      where.level = level;
    }

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    return this.prisma.lesson.findMany({
      where,
      select: {
        id: true,
        skill: true,
        title: true,
        description: true,
        lessonType: true,
        level: true,
        topic: true,
        timeLimit: true,
        thumbnailUrl: true,
        tags: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        content: false,
        createdById: true,
        deletedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }) as Promise<ILesson[]>;
  }

  async findById(id: string): Promise<ILesson> {
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
        levelRef: true,
        topicRef: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return lesson;
  }

  async createLesson(
    skillType: SkillType,
    dto: CreateLessonDto,
    userId: string,
  ): Promise<ILesson> {
    // Validate reference data
    const [levelExists, topicExists] = await Promise.all([
      this.prisma.referenceData.findUnique({ where: { code: dto.level } }),
      this.prisma.referenceData.findUnique({ where: { code: dto.topic } }),
    ]);

    if (!levelExists || !topicExists) {
      throw new ForbiddenException('Invalid level or topic reference');
    }

    return this.prisma.lesson.create({
      data: {
        ...dto,
        skill: skillType,
        createdById: userId,
        status: dto.status || ContentStatus.draft,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
        levelRef: true,
        topicRef: true,
      },
    });
  }

  async updateLesson(
    id: string,
    dto: UpdateLessonDto,
    userId: string,
  ): Promise<ILesson> {
    const lesson = await this.findById(id);

    if (lesson.createdById !== userId) {
      throw new ForbiddenException('You can only update your own lessons');
    }

    if (dto.level || dto.topic) {
      const [levelExists, topicExists] = await Promise.all([
        dto.level
          ? this.prisma.referenceData.findUnique({ where: { code: dto.level } })
          : true,
        dto.topic
          ? this.prisma.referenceData.findUnique({ where: { code: dto.topic } })
          : true,
      ]);

      if (!levelExists || !topicExists) {
        throw new ForbiddenException('Invalid level or topic reference');
      }
    }

    return this.prisma.lesson.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
        levelRef: true,
        topicRef: true,
      },
    });
  }

  async deleteLesson(id: string): Promise<void> {
    const lesson = await this.findById(id);

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (lesson.status === ContentStatus.deleted) {
      throw new ForbiddenException('Lesson is already deleted');
    }

    // Check if lesson has any submissions
    const hasSubmissions = await this.prisma.lessonSubmission.count({
      where: { lessonId: id },
    });

    if (hasSubmissions) {
      // Soft delete if has submissions
      await this.prisma.lesson.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          status: ContentStatus.deleted,
        },
      });
    } else {
      // Hard delete if no submissions
      await this.prisma.lesson.delete({
        where: { id },
      });
    }
  }
}
