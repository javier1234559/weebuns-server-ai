import { Injectable, NotFoundException } from '@nestjs/common';
import {
  notDeletedQuery,
  paginationQuery,
  searchQuery,
  softDeleteQuery,
} from 'src/common/helper/prisma-queries.helper';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  FindAllLessonQuery,
  CreateReadingDTO,
  UpdateReadingDTO,
  CreateListeningDTO,
  CreateSpeakingDTO,
  CreateWritingDTO,
  UpdateListeningDTO,
  UpdateSpeakingDTO,
  UpdateWritingDTO,
} from './dto/lesson-request.dto';
import {
  LessonsResponse,
  DeleteLessonResponse,
  ReadingResponse,
  ListeningResponse,
  SpeakingResponse,
  WritingResponse,
} from './dto/lesson-response.dto';
import { ILessonService } from './interface/lesson-service.interface';
import { Prisma, SkillType } from '@prisma/client';
import { ContentReadingDTO } from './dto/content/reading.dto';
import { ContentListeningDTO } from './dto/content/listening.dto';
import { ContentWritingDTO } from './dto/content/writing.dto';
import { ContentSpeakingDTO } from './dto/content/speaking.dto';
import { calculatePagination } from 'src/common/utils/pagination';

@Injectable()
export class LessonService implements ILessonService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly lessonIncludeQuery = {
    include: {
      createdBy: {
        include: {
          teacherProfile: true,
          studentProfile: true,
        },
      },
      // submissions: true,
    },
  };

  private transformContent(content: any, skill: SkillType) {
    switch (skill) {
      case 'reading':
        return content as ContentReadingDTO;
      case 'listening':
        return content as ContentListeningDTO;
      case 'writing':
        return content as ContentWritingDTO;
      case 'speaking':
        return content as ContentSpeakingDTO;
      default:
        return content;
    }
  }

  async findAll(query: FindAllLessonQuery): Promise<LessonsResponse> {
    const {
      page,
      perPage,
      skill,
      level,
      search,
      status,
      topic,
      tag,
      lessonType,
    } = query;

    const queryOptions = {
      where: {
        ...notDeletedQuery,
        ...(status && { status }),
        ...(topic && { topic }),
        ...(level && { level }),
        ...(skill && { skill }),
        ...(lessonType && { lessonType }),
        ...(tag && { tags: { has: tag } }),
        ...(search ? searchQuery(search, ['title']) : {}),
      },
      orderBy: { createdAt: 'desc' },
      ...paginationQuery(page, perPage),
    };

    const [lessons, totalItems] = await Promise.all([
      this.prisma.lesson.findMany(queryOptions),
      this.prisma.lesson.count({ where: queryOptions.where }),
    ]);

    return {
      data: lessons,
      pagination: calculatePagination(totalItems, query),
    };
  }

  async delete(id: string): Promise<DeleteLessonResponse> {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id, ...notDeletedQuery },
      include: {
        submissions: true, // Check for related submissions
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    if (lesson.submissions.length > 0) {
      // If there are related submissions, delete from database
      await this.prisma.lesson.delete({
        where: { id },
      });
    } else {
      // If no relations, perform soft delete
      await this.prisma.lesson.update({
        where: { id },
        data: {
          ...softDeleteQuery,
        },
      });
    }

    return { message: 'Lesson deleted successfully' };
  }

  async findOneReading(id: string): Promise<ReadingResponse> {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        id,
        skill: 'reading' as SkillType,
        ...notDeletedQuery,
      },
      ...this.lessonIncludeQuery,
    });

    if (!lesson) {
      throw new NotFoundException(`Reading lesson with ID ${id} not found`);
    }

    return {
      data: {
        ...lesson,
        content: this.transformContent(lesson.content, 'reading'),
      },
    };
  }

  async createReading(dto: CreateReadingDTO): Promise<ReadingResponse> {
    console.log(dto.content);

    const lesson = await this.prisma.lesson.create({
      data: {
        ...dto,
        skill: 'reading' as SkillType,
        createdById: dto.createdById!,
        content: dto.content as any,
      },
      ...this.lessonIncludeQuery,
    });

    return {
      data: {
        ...lesson,
        content: this.transformContent(lesson.content, 'reading'),
      },
    };
  }

  async updateReading(
    id: string,
    dto: UpdateReadingDTO,
  ): Promise<ReadingResponse> {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        id,
        skill: 'reading' as SkillType,
        ...notDeletedQuery,
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Reading lesson with ID ${id} not found`);
    }

    const updatedLesson = await this.prisma.lesson.update({
      where: { id },
      data: {
        ...dto,
        skill: 'reading' as SkillType,
        content: dto.content as unknown as Prisma.InputJsonValue,
      },
      ...this.lessonIncludeQuery,
    });

    return {
      data: {
        ...updatedLesson,
        content: this.transformContent(updatedLesson.content, 'reading'),
      },
    };
  }

  async findOneListening(id: string): Promise<ListeningResponse> {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        id,
        skill: 'listening' as SkillType,
        ...notDeletedQuery,
      },
      ...this.lessonIncludeQuery,
    });

    if (!lesson) {
      throw new NotFoundException(`Listening lesson with ID ${id} not found`);
    }

    return {
      data: {
        ...lesson,
        content: this.transformContent(lesson.content, 'listening'),
      },
    };
  }

  async createListening(dto: CreateListeningDTO): Promise<ListeningResponse> {
    const lesson = await this.prisma.lesson.create({
      data: {
        ...dto,
        skill: 'listening' as SkillType,
        createdById: dto.createdById!,
        content: dto.content as any,
      },
      ...this.lessonIncludeQuery,
    });

    console.log(lesson);

    return {
      data: {
        ...lesson,
        content: this.transformContent(lesson.content, 'listening'),
      },
    };
  }

  async updateListening(
    id: string,
    dto: UpdateListeningDTO,
  ): Promise<ListeningResponse> {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        id,
        skill: 'listening' as SkillType,
        ...notDeletedQuery,
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Listening lesson with ID ${id} not found`);
    }

    const updatedLesson = await this.prisma.lesson.update({
      where: { id },
      data: {
        ...dto,
        skill: 'listening' as SkillType,
        content: dto.content as any,
      },
      ...this.lessonIncludeQuery,
    });

    return {
      data: {
        ...updatedLesson,
        content: this.transformContent(updatedLesson.content, 'listening'),
      },
    };
  }

  async findOneSpeaking(id: string): Promise<SpeakingResponse> {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        id,
        skill: 'speaking' as SkillType,
        ...notDeletedQuery,
      },
      ...this.lessonIncludeQuery,
    });

    if (!lesson) {
      throw new NotFoundException(`Speaking lesson with ID ${id} not found`);
    }

    return {
      data: {
        ...lesson,
        content: this.transformContent(lesson.content, 'speaking'),
      },
    };
  }

  async createSpeaking(dto: CreateSpeakingDTO): Promise<SpeakingResponse> {
    const lesson = await this.prisma.lesson.create({
      data: {
        ...dto,
        skill: 'speaking' as SkillType,
        createdById: dto.createdById!,
        content: dto.content as any,
      },
      ...this.lessonIncludeQuery,
    });

    return {
      data: {
        ...lesson,
        content: this.transformContent(lesson.content, 'speaking'),
      },
    };
  }

  async updateSpeaking(
    id: string,
    dto: UpdateSpeakingDTO,
  ): Promise<SpeakingResponse> {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        id,
        skill: 'speaking' as SkillType,
        ...notDeletedQuery,
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Speaking lesson with ID ${id} not found`);
    }

    const updatedLesson = await this.prisma.lesson.update({
      where: { id },
      data: {
        ...dto,
        skill: 'speaking' as SkillType,
        content: dto.content as any,
      },
      ...this.lessonIncludeQuery,
    });

    return {
      data: {
        ...updatedLesson,
        content: this.transformContent(updatedLesson.content, 'speaking'),
      },
    };
  }

  async findOneWriting(id: string): Promise<WritingResponse> {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        id,
        skill: 'writing' as SkillType,
        ...notDeletedQuery,
      },
      ...this.lessonIncludeQuery,
    });

    if (!lesson) {
      throw new NotFoundException(`Writing lesson with ID ${id} not found`);
    }

    return {
      data: {
        ...lesson,
        content: this.transformContent(lesson.content, 'writing'),
      },
    };
  }

  async createWriting(dto: CreateWritingDTO): Promise<WritingResponse> {
    const lesson = await this.prisma.lesson.create({
      data: {
        ...dto,
        skill: 'writing' as SkillType,
        createdById: dto.createdById!,
        content: dto.content as any,
      },
      ...this.lessonIncludeQuery,
    });

    return {
      data: {
        ...lesson,
        content: this.transformContent(lesson.content, 'writing'),
      },
    };
  }

  async updateWriting(
    id: string,
    dto: UpdateWritingDTO,
  ): Promise<WritingResponse> {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        id,
        skill: 'writing' as SkillType,
        ...notDeletedQuery,
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Writing lesson with ID ${id} not found`);
    }

    const updatedLesson = await this.prisma.lesson.update({
      where: { id },
      data: {
        ...dto,
        skill: 'writing' as SkillType,
        content: dto.content as any,
      },
      ...this.lessonIncludeQuery,
    });

    return {
      data: {
        ...updatedLesson,
        content: this.transformContent(updatedLesson.content, 'writing'),
      },
    };
  }
}
