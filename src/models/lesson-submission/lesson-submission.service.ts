import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ILessonSubmissionService } from './interface/lesson-submission-service.interface';
import {
  CreateReadingSubmissionDTO,
  CreateListeningSubmissionDTO,
  CreateSpeakingSubmissionDTO,
  CreateWritingSubmissionDTO,
  FindAllLessonSubmissionQuery,
  UpdateReadingSubmissionDTO,
  UpdateListeningSubmissionDTO,
  UpdateSpeakingSubmissionDTO,
  UpdateWritingSubmissionDTO,
} from './dto/lesson-submission-request.dto';
import {
  DeleteLessonSubmissionResponse,
  LessonSubmissionsResponse,
  ReadingSubmissionResponse,
  ListeningSubmissionResponse,
  SpeakingSubmissionResponse,
  WritingSubmissionResponse,
} from './dto/lesson-submission-response.dto';
import {
  notDeletedQuery,
  searchQuery,
  paginationQuery,
  softDeleteQuery,
} from 'src/common/helper/prisma-queries.helper';
import { SkillType, SubmissionStatus } from '@prisma/client';
import { calculatePagination } from 'src/common/utils/pagination';
import { FeedbackDTO } from './dto/feedback.dto';

@Injectable()
export class LessonSubmissionService implements ILessonSubmissionService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly submissionIncludeQuery = {
    include: {
      lesson: true,
      user: {
        include: {
          teacherProfile: true,
          studentProfile: true,
        },
      },
      gradedBy: {
        include: {
          teacherProfile: true, // Thêm profile giáo viên
          studentProfile: true, // Thêm profile học sinh
        },
      },
    },
  };

  private transformContent(content: any, type: SkillType) {
    switch (type) {
      case 'reading':
        return content;
      case 'listening':
        return content;
      case 'writing':
        return content;
      case 'speaking':
        return content;
      default:
        return content;
    }
  }

  async findAllSubmissions(
    query: FindAllLessonSubmissionQuery,
  ): Promise<LessonSubmissionsResponse> {
    const {
      page,
      perPage,
      userId,
      lessonId,
      submissionType,
      status,
      gradedById,
    } = query;

    const queryOptions = {
      where: {
        ...notDeletedQuery,
        ...(userId && { userId }),
        ...(lessonId && { lessonId }),
        ...(submissionType && { submissionType }),
        ...(status && { status }),
        ...(gradedById && { gradedById }),
      },
      orderBy: { createdAt: 'desc' },
      ...paginationQuery(page, perPage),
      ...this.submissionIncludeQuery,
    };

    const [submissions, totalItems] = await Promise.all([
      this.prisma.lessonSubmission.findMany(queryOptions),
      this.prisma.lessonSubmission.count({ where: queryOptions.where }),
    ]);

    return {
      data: submissions,
      pagination: calculatePagination(totalItems, query),
    };
  }

  async delete(id: string): Promise<DeleteLessonSubmissionResponse> {
    const submission = await this.prisma.lessonSubmission.findFirst({
      where: { id, ...notDeletedQuery },
    });

    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    await this.prisma.lessonSubmission.update({
      where: { id },
      data: {
        ...softDeleteQuery,
      },
    });

    return { message: 'Submission deleted successfully' };
  }

  async findOneReadingSubmission(
    id: string,
  ): Promise<ReadingSubmissionResponse> {
    const submission = await this.prisma.lessonSubmission.findFirst({
      where: {
        id,
        submissionType: 'reading' as SkillType,
        ...notDeletedQuery,
      },
      ...this.submissionIncludeQuery,
    });

    if (!submission) {
      throw new NotFoundException(`Reading submission with ID ${id} not found`);
    }

    return {
      data: {
        ...submission,
        content: this.transformContent(submission.content, 'reading'),
      },
    };
  }

  async createReadingSubmission(
    dto: CreateReadingSubmissionDTO,
  ): Promise<ReadingSubmissionResponse> {
    const submission = await this.prisma.lessonSubmission.create({
      data: {
        ...dto,
        content: dto.content as any,
        submittedAt: new Date(),
      },
      ...this.submissionIncludeQuery,
    });

    return {
      data: {
        ...submission,
        content: this.transformContent(submission.content, 'reading'),
      },
    };
  }

  async updateReadingSubmission(
    id: string,
    dto: UpdateReadingSubmissionDTO,
  ): Promise<ReadingSubmissionResponse> {
    const submission = await this.prisma.lessonSubmission.findFirst({
      where: {
        id,
        submissionType: 'reading' as SkillType,
        ...notDeletedQuery,
      },
    });

    if (!submission) {
      throw new NotFoundException(`Reading submission with ID ${id} not found`);
    }

    const updatedSubmission = await this.prisma.lessonSubmission.update({
      where: { id },
      data: {
        ...dto,
        content: dto.content as any,
      },
      ...this.submissionIncludeQuery,
    });

    return {
      data: {
        ...updatedSubmission,
        content: this.transformContent(updatedSubmission.content, 'reading'),
      },
    };
  }

  async findOneListeningSubmission(
    id: string,
  ): Promise<ListeningSubmissionResponse> {
    const submission = await this.prisma.lessonSubmission.findFirst({
      where: {
        id,
        submissionType: 'listening' as SkillType,
        ...notDeletedQuery,
      },
      ...this.submissionIncludeQuery,
    });

    if (!submission) {
      throw new NotFoundException(
        `Listening submission with ID ${id} not found`,
      );
    }

    return {
      data: {
        ...submission,
        content: this.transformContent(submission.content, 'listening'),
      },
    };
  }

  async createListeningSubmission(
    dto: CreateListeningSubmissionDTO,
  ): Promise<ListeningSubmissionResponse> {
    const submission = await this.prisma.lessonSubmission.create({
      data: {
        ...dto,
        content: dto.content as any,
        submittedAt: new Date(),
      },
      ...this.submissionIncludeQuery,
    });

    return {
      data: {
        ...submission,
        content: this.transformContent(submission.content, 'listening'),
      },
    };
  }

  async updateListeningSubmission(
    id: string,
    dto: UpdateListeningSubmissionDTO,
  ): Promise<ListeningSubmissionResponse> {
    const submission = await this.prisma.lessonSubmission.findFirst({
      where: {
        id,
        submissionType: 'listening' as SkillType,
        ...notDeletedQuery,
      },
    });

    if (!submission) {
      throw new NotFoundException(
        `Listening submission with ID ${id} not found`,
      );
    }

    const updatedSubmission = await this.prisma.lessonSubmission.update({
      where: { id },
      data: {
        ...dto,
        content: dto.content as any,
      },
      ...this.submissionIncludeQuery,
    });

    return {
      data: {
        ...updatedSubmission,
        content: this.transformContent(updatedSubmission.content, 'listening'),
      },
    };
  }

  async findOneSpeakingSubmission(
    id: string,
  ): Promise<SpeakingSubmissionResponse> {
    const submission = await this.prisma.lessonSubmission.findFirst({
      where: {
        id,
        submissionType: 'speaking' as SkillType,
        ...notDeletedQuery,
      },
      ...this.submissionIncludeQuery,
    });

    if (!submission) {
      throw new NotFoundException(
        `Speaking submission with ID ${id} not found`,
      );
    }

    return {
      data: {
        ...submission,
        content: this.transformContent(submission.content, 'speaking'),
      },
    };
  }

  async createSpeakingSubmission(
    dto: CreateSpeakingSubmissionDTO,
  ): Promise<SpeakingSubmissionResponse> {
    const submission = await this.prisma.lessonSubmission.create({
      data: {
        ...dto,
        content: dto.content as any,
        submittedAt: new Date(),
      },
      ...this.submissionIncludeQuery,
    });

    return {
      data: {
        ...submission,
        content: this.transformContent(submission.content, 'speaking'),
      },
    };
  }

  async updateSpeakingSubmission(
    id: string,
    dto: UpdateSpeakingSubmissionDTO,
  ): Promise<SpeakingSubmissionResponse> {
    const submission = await this.prisma.lessonSubmission.findFirst({
      where: {
        id,
        submissionType: 'speaking' as SkillType,
        ...notDeletedQuery,
      },
    });

    if (!submission) {
      throw new NotFoundException(
        `Speaking submission with ID ${id} not found`,
      );
    }

    const updatedSubmission = await this.prisma.lessonSubmission.update({
      where: { id },
      data: {
        ...dto,
        content: dto.content as any,
      },
      ...this.submissionIncludeQuery,
    });

    return {
      data: {
        ...updatedSubmission,
        content: this.transformContent(updatedSubmission.content, 'speaking'),
      },
    };
  }

  async findOneWritingSubmission(
    id: string,
  ): Promise<WritingSubmissionResponse> {
    const submission = await this.prisma.lessonSubmission.findFirst({
      where: {
        id,
        submissionType: 'writing' as SkillType,
        ...notDeletedQuery,
      },
      ...this.submissionIncludeQuery,
    });

    if (!submission) {
      throw new NotFoundException(`Writing submission with ID ${id} not found`);
    }

    return {
      data: {
        ...submission,
        content: this.transformContent(submission.content, 'writing'),
      },
    };
  }

  async createWritingSubmission(
    dto: CreateWritingSubmissionDTO,
  ): Promise<WritingSubmissionResponse> {
    const submission = await this.prisma.lessonSubmission.create({
      data: {
        ...dto,
        content: dto.content as any,
        submittedAt: new Date(),
      },
      ...this.submissionIncludeQuery,
    });

    return {
      data: {
        ...submission,
        content: this.transformContent(submission.content, 'writing'),
      },
    };
  }

  async updateWritingSubmission(
    id: string,
    dto: UpdateWritingSubmissionDTO,
  ): Promise<WritingSubmissionResponse> {
    const submission = await this.prisma.lessonSubmission.findFirst({
      where: {
        id,
        submissionType: 'writing' as SkillType,
        ...notDeletedQuery,
      },
    });

    if (!submission) {
      throw new NotFoundException(`Writing submission with ID ${id} not found`);
    }

    const updatedSubmission = await this.prisma.lessonSubmission.update({
      where: { id },
      data: {
        ...dto,
        content: dto.content as any,
      },
      ...this.submissionIncludeQuery,
    });

    return {
      data: {
        ...updatedSubmission,
        content: this.transformContent(updatedSubmission.content, 'writing'),
      },
    };
  }

  async updateWritingTeacherFeedback(
    id: string,
    dto: FeedbackDTO,
    teacherId: string,
  ): Promise<WritingSubmissionResponse> {
    const submission = await this.prisma.lessonSubmission.findFirst({
      where: {
        id,
        submissionType: 'writing' as SkillType,
        ...notDeletedQuery,
      },
    });

    if (!submission) {
      throw new NotFoundException(`Writing submission with ID ${id} not found`);
    }

    const updatedSubmission = await this.prisma.lessonSubmission.update({
      where: { id },
      data: {
        feedback: {
          // Convert to JSON to store in Prisma JsonB field
          value: JSON.stringify({
            overall_score: dto.overall_score,
            task_response: dto.task_response,
            coherence_cohesion: dto.coherence_cohesion,
            lexical_resource: dto.lexical_resource,
            grammar: dto.grammar,
            corrections: dto.corrections,
            overall_feedback: dto.overall_feedback,
          }),
        },
        status: SubmissionStatus.scored,
        gradedAt: new Date(),
        gradedById: teacherId,
      },
      ...this.submissionIncludeQuery,
    });

    return {
      data: {
        ...updatedSubmission,
        content: this.transformContent(updatedSubmission.content, 'writing'),
      },
    };
  }
}
