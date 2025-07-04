import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ILessonSubmissionService } from './interface/lesson-submission-service.interface';
import {
  CreateReadingSubmissionDTO,
  CreateListeningSubmissionDTO,
  CreateSpeakingSubmissionDTO,
  CreateWritingSubmissionDTO,
  FindAllLessonSubmissionQuery,
  UpdateWritingSubmissionDTO,
  FindAllReadingSubmissionsByUserQuery,
  UpdateSpeakingSubmissionDTO,
} from './dto/lesson-submission-request.dto';
import {
  DeleteLessonSubmissionResponse,
  LessonSubmissionsResponse,
  ReadingSubmissionResponse,
  ListeningSubmissionResponse,
  SpeakingSubmissionResponse,
  WritingSubmissionResponse,
  ReadingSubmission,
  ListeningSubmission,
  SpeakingSubmission,
  WritingSubmission,
  WritingSubmissionResultResponse,
} from './dto/lesson-submission-response.dto';
import {
  notDeletedQuery,
  paginationQuery,
  softDeleteQuery,
} from 'src/common/helper/prisma-queries.helper';
import { SkillType, SubmissionStatus, LessonSubmission } from '@prisma/client';
import { calculatePagination } from 'src/common/utils/pagination';
import { ReadingFeedbackDto } from './dto/feedback/reading.dto';
import { ListeningFeedbackDto } from './dto/feedback/listening.dto';
import { WritingFeedbackDTO } from './dto/feedback/writing.dto';
import { ContentReadingSubmissionDTO } from './dto/content/reading-submission.dto';
import { ContentListeningSubmissionDTO } from './dto/content/listening-submission.dto';
import { ContentWritingSubmissionDTO } from './dto/content/writing-submission.dto';
import { ContentSpeakingSubmissionDTO } from './dto/content/speaking-submission.dto';
import { formatNumberPrecision, serializeJSON } from 'src/common/utils/format';
import {
  ContentWritingDTO,
  SampleEssayDTO,
} from 'src/models/lesson/dto/content/writing.dto';
import { Prisma } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SubmissionEventType } from './events/submission.event';
import config from 'src/config';

@Injectable()
export class LessonSubmissionService implements ILessonSubmissionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private readonly submissionIncludeQuery = {
    include: {
      lesson: true,
      user: true,
      gradedBy: true,
    },
  };

  private transformContent(content: any, skill: SkillType) {
    switch (skill) {
      case 'reading':
        return content as ContentReadingSubmissionDTO;
      case 'listening':
        return content as ContentListeningSubmissionDTO;
      case 'writing':
        return content as ContentWritingSubmissionDTO;
      case 'speaking':
        return content as ContentSpeakingSubmissionDTO;
      default:
        return content;
    }
  }

  private transformFeedback(feedback: any, type: SkillType) {
    switch (type) {
      case 'reading':
        return feedback as ReadingFeedbackDto;
      case 'listening':
        return feedback as ListeningFeedbackDto;
      case 'writing':
        return feedback as WritingFeedbackDTO;
      case 'speaking':
        return feedback;
      default:
        return feedback;
    }
  }

  async findAllSubmissions(
    query: FindAllLessonSubmissionQuery,
  ): Promise<LessonSubmissionsResponse> {
    const { page, perPage, userId, lessonId, submissionType, status, search } =
      query;

    const queryOptions = {
      where: {
        ...notDeletedQuery,
        ...(userId && { userId }),
        ...(lessonId && { lessonId }),
        ...(submissionType && { submissionType }),
        ...(status && { status }),
        ...(search
          ? {
              lesson: {
                title: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            }
          : {}),
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
      data: submissions as unknown as LessonSubmission[],
      pagination: calculatePagination(totalItems, query),
    };
  }

  async getAllSubmissionsByUser(
    userId: string,
    query: FindAllReadingSubmissionsByUserQuery,
  ): Promise<LessonSubmissionsResponse> {
    const { page, perPage, search, submissionType, status } = query;

    const queryOptions = {
      where: {
        userId,
        ...notDeletedQuery,
        ...(submissionType && { submissionType }),
        ...(status && { status }),
        ...(search
          ? {
              lesson: {
                title: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            }
          : {}),
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
      data: submissions as unknown as LessonSubmission[],
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

    const transformedSubmission = {
      ...submission,
      content: this.transformContent(submission.content, 'reading'),
      feedback: this.transformFeedback(submission.feedback, 'reading'),
    } as ReadingSubmission;

    return {
      data: transformedSubmission,
    };
  }

  async createReadingSubmission(
    userId: string,
    dto: CreateReadingSubmissionDTO,
  ): Promise<ReadingSubmissionResponse> {
    // Calculate feedback based on questions
    const correctAnswers = dto.content.questions.filter(
      (q) => q.selected_answer === q.right_answer,
    ).length;
    const feedback: ReadingFeedbackDto = {
      totalQuestions: dto.content.questions.length,
      correctAnswers,
      incorrectAnswers: dto.content.questions.length - correctAnswers,
      accuracy: formatNumberPrecision(
        (correctAnswers / dto.content.questions.length) * 100,
      ),
      youtube_embed_url: dto.content.youtube_embed_url,
    };

    console.log(JSON.stringify(feedback, null, 2));
    const submission = await this.prisma.lessonSubmission.create({
      data: {
        lessonId: dto.lessonId,
        userId: userId,
        submissionType: 'reading' as SkillType,
        status: SubmissionStatus.submitted,
        tokensUsed: dto.tokensUsed,
        content: serializeJSON(dto.content),
        feedback: serializeJSON(feedback),
        submittedAt: new Date(),
      },
      ...this.submissionIncludeQuery,
    });

    const transformedSubmission = {
      ...submission,
      content: this.transformContent(submission.content, 'reading'),
      feedback: this.transformFeedback(submission.feedback, 'reading'),
    } as ReadingSubmission;

    return {
      data: transformedSubmission,
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
        feedback: this.transformFeedback(submission.feedback, 'listening'),
      } as ListeningSubmission,
    };
  }

  async createListeningSubmission(
    userId: string,
    dto: CreateListeningSubmissionDTO,
  ): Promise<ListeningSubmissionResponse> {
    // Calculate feedback based on questions
    const correctAnswers = dto.content.question_list.filter(
      (q) => q.selected_answer === q.right_answer,
    ).length;
    const feedback: ListeningFeedbackDto = {
      totalQuestions: dto.content.question_list.length,
      correctAnswers,
      incorrectAnswers: dto.content.question_list.length - correctAnswers,
      accuracy: formatNumberPrecision(
        (correctAnswers / dto.content.question_list.length) * 100,
      ),
      youtube_embed_url: dto.content.youtube_embed_url,
    };

    const submission = await this.prisma.lessonSubmission.create({
      data: {
        lessonId: dto.lessonId,
        userId: userId,
        submissionType: 'listening' as SkillType,
        status: SubmissionStatus.submitted,
        tokensUsed: dto.tokensUsed,
        content: serializeJSON(dto.content),
        feedback: serializeJSON(feedback),
        submittedAt: new Date(),
      },
      ...this.submissionIncludeQuery,
    });

    return {
      data: {
        ...submission,
        content: this.transformContent(submission.content, 'listening'),
        feedback: this.transformFeedback(submission.feedback, 'listening'),
      } as ListeningSubmission,
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
      } as SpeakingSubmission,
    };
  }

  async createSpeakingSubmission(
    userId: string,
    dto: CreateSpeakingSubmissionDTO,
  ): Promise<SpeakingSubmissionResponse> {
    const submission = await this.prisma.lessonSubmission.create({
      data: {
        lessonId: dto.lessonId,
        userId: userId,
        submissionType: 'speaking' as SkillType,
        status: SubmissionStatus.submitted,
        tokensUsed: dto.tokensUsed,
        content: serializeJSON(dto.content),
        submittedAt: new Date(),
      },
      ...this.submissionIncludeQuery,
    });

    return {
      data: {
        ...submission,
        content: this.transformContent(submission.content, 'speaking'),
      } as SpeakingSubmission,
    };
  }

  async findOneWritingSubmission(
    id: string,
  ): Promise<WritingSubmissionResultResponse> {
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

    const lesson = await this.prisma.lesson.findFirst({
      where: {
        id: submission.lessonId,
        skill: SkillType.writing,
      },
    });
    const content = lesson?.content as unknown as ContentWritingDTO;
    const exampleEssay = content.resources.sample_essay;

    // Transform the submission to match WritingSubmission type
    const transformedSubmission: WritingSubmission = {
      ...submission,
      content: this.transformContent(submission.content, 'writing'),
      feedback: this.transformFeedback(submission.feedback, 'writing'),
    } as WritingSubmission;

    // Return the response with the correct structure
    return {
      data: transformedSubmission,
      exampleEssay: exampleEssay as SampleEssayDTO & Prisma.JsonValue,
    };
  }

  async createWritingSubmission(
    userId: string,
    dto: CreateWritingSubmissionDTO,
  ): Promise<WritingSubmissionResponse> {
    const submission = await this.prisma.lessonSubmission.create({
      data: {
        lessonId: dto.lessonId,
        userId: userId,
        submissionType: 'writing' as SkillType,
        status: dto.status,
        tokensUsed: dto.tokensUsed,
        content: serializeJSON(dto.content),
        submittedAt: new Date(),
      },
      ...this.submissionIncludeQuery,
    });

    console.log(submission);

    return {
      data: {
        ...submission,
        content: this.transformContent(submission.content, 'writing'),
        feedback: this.transformFeedback(submission.feedback, 'writing'),
      } as WritingSubmission,
    };
  }

  private async handleSubmissionNotification(
    submission: any,
    userId: string,
    content: string,
  ) {
    try {
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: submission.lessonId },
        select: { title: true },
      });

      if (!lesson) {
        console.error(
          'Lesson not found for notification:',
          submission.lessonId,
        );
        return;
      }

      this.eventEmitter.emit(SubmissionEventType.SUBMISSION_GRADED, {
        createdBy: userId, // teacher who graded
        userId: submission.userId, // student who submitted
        submissionId: submission.id,
        lessonTitle: lesson.title,
        thumbnailUrl: submission.lesson.thumbnailUrl,
        content,
        actionUrl: `${config.client_url}/lesson/writing/${submission.lessonId}/result?submissionId=${submission.id}`,
      });
    } catch (error) {
      console.error('Error handling submission notification:', error);
    }
  }

  async updateWritingSubmission(
    id: string,
    userId: string,
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

    const tokenUsed = submission.tokensUsed;

    const updatedSubmission = await this.prisma.lessonSubmission.update({
      where: { id },
      data: {
        ...dto,
        content: dto.content ? serializeJSON(dto.content) : undefined,
        feedback: dto.feedback ? serializeJSON(dto.feedback) : undefined,
        status: SubmissionStatus.scored,
        gradedAt: new Date(),
        gradedById: userId,
        tokensUsed: 0, // Burn tokens by setting to 0
      },
      ...this.submissionIncludeQuery,
    });

    // Handle notification asynchronously
    this.handleSubmissionNotification(
      updatedSubmission,
      userId,
      'Giáo viên đã chấm điểm bài nộp của bạn.',
    ).catch((error) => {
      console.error('Failed to handle submission notification:', error);
    });

    this.eventEmitter.emit(SubmissionEventType.SUBMISSION_CLAIMED, {
      teacherId: updatedSubmission.gradedById,
      tokenUsed: tokenUsed, // Pass the original token value
    });

    return {
      data: {
        ...updatedSubmission,
        content: this.transformContent(updatedSubmission.content, 'writing'),
        feedback: this.transformFeedback(updatedSubmission.feedback, 'writing'),
      } as WritingSubmission,
    };
  }

  async claimSubmission(
    teacherId: string,
    submissionId: string,
  ): Promise<WritingSubmissionResponse> {
    const submission = await this.prisma.lessonSubmission.findFirst({
      where: {
        id: submissionId,
        ...notDeletedQuery,
      },
    });

    if (!submission) {
      throw new NotFoundException(
        `Writing submission with ID ${submissionId} not found`,
      );
    }

    if (submission.gradedById && submission.status === SubmissionStatus.taken) {
      throw new ConflictException(
        'Submission has been claimed by another teacher',
      );
    }

    await this.prisma.lessonSubmission.update({
      where: { id: submissionId },
      data: {
        status: SubmissionStatus.taken,
        gradedById: teacherId,
      },
    });

    return {
      data: {
        ...submission,
        content: this.transformContent(submission.content, 'writing'),
        feedback: this.transformFeedback(submission.feedback, 'writing'),
      } as WritingSubmission,
    };
  }

  async cancelClaimSubmission(
    teacherId: string,
    submissionId: string,
  ): Promise<WritingSubmissionResponse> {
    const submission = await this.prisma.lessonSubmission.findFirst({
      where: {
        id: submissionId,
        status: SubmissionStatus.taken,
        gradedById: teacherId,
        ...notDeletedQuery,
      },
    });

    if (!submission) {
      throw new NotFoundException(
        `Writing submission with ID ${submissionId} not found`,
      );
    }

    await this.prisma.lessonSubmission.update({
      where: { id: submissionId },
      data: {
        status: SubmissionStatus.submitted,
        gradedById: null,
      },
    });

    return {
      data: {
        ...submission,
        content: this.transformContent(submission.content, 'writing'),
        feedback: this.transformFeedback(submission.feedback, 'writing'),
      } as WritingSubmission,
    };
  }

  async updateSpeakingSubmission(
    submissionId: string,
    userId: string,
    dto: UpdateSpeakingSubmissionDTO,
  ): Promise<SpeakingSubmissionResponse> {
    const submission = await this.prisma.lessonSubmission.findFirst({
      where: {
        id: submissionId,
        userId,
        submissionType: 'speaking' as SkillType,
        ...notDeletedQuery,
      },
    });

    if (!submission) {
      throw new NotFoundException(
        `Speaking submission with ID ${submissionId} not found`,
      );
    }

    const updatedSubmission = await this.prisma.lessonSubmission.update({
      where: { id: submissionId },
      data: {
        status: dto.status,
        tokensUsed: dto.tokensUsed,
        content: serializeJSON(dto.content),
        submittedAt: new Date(),
      },
      ...this.submissionIncludeQuery,
    });

    return {
      data: {
        ...updatedSubmission,
        content: this.transformContent(updatedSubmission.content, 'speaking'),
      } as SpeakingSubmission,
    };
  }
}
