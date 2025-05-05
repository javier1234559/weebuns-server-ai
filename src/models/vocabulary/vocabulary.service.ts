import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from 'src/common/decorators/role.decorator';
import { IAuthPayload } from 'src/common/interface/auth-payload.interface';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { paginationQuery } from 'src/common/helper/prisma-queries.helper';
import { calculatePagination } from 'src/common/utils/pagination';
import {
  CreateVocabularyDto,
  UpdateVocabularyDto,
  FindAllVocabularyQuery,
  UpdateVocabularyReviewDto,
} from './dto/vocabulary-request.dto';
import {
  VocabularyResponseDto,
  VocabulariesResponse,
  DeleteVocabularyResponse,
} from './dto/vocabulary-response.dto';

@Injectable()
export class VocabularyService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly includeQuery = {
    include: {
      createdBy: {
        include: {
          teacherProfile: true,
          studentProfile: true,
        },
      },
      practices: true,
    },
  };

  private async checkVocabularyPermission(
    id: string,
    user: IAuthPayload,
  ): Promise<any> {
    const vocabulary = await this.prisma.vocabulary.findFirst({
      where: { id },
      ...this.includeQuery,
    });

    if (!vocabulary) {
      throw new NotFoundException(`Vocabulary with ID ${id} not found`);
    }

    if (
      user.role !== UserRole.ADMIN.toString() &&
      vocabulary.createdById !== user.sub.toString()
    ) {
      throw new ForbiddenException(
        'You do not have permission to access this vocabulary',
      );
    }

    return vocabulary;
  }

  async create(
    createVocabularyDto: CreateVocabularyDto,
    user: IAuthPayload,
  ): Promise<VocabularyResponseDto> {
    if (!user) {
      throw new UnauthorizedException(
        'You must be logged in to create vocabulary',
      );
    }

    const vocabulary = await this.prisma.vocabulary.create({
      data: {
        ...createVocabularyDto,
        createdById: user.sub.toString(),
      },
      ...this.includeQuery,
    });

    return {
      data: vocabulary,
    };
  }

  async findAll(
    query: FindAllVocabularyQuery,
    user: IAuthPayload,
  ): Promise<VocabulariesResponse> {
    const { page, perPage, search, repetitionLevel, dueDate } = query;

    const queryOptions = {
      where: {
        ...(search && {
          term: {
            contains: search,
            mode: 'insensitive',
          },
        }),
        ...(repetitionLevel !== undefined && { repetitionLevel }),
        ...(user.role !== UserRole.ADMIN.toString() && {
          createdById: user.sub.toString(),
        }),
        ...(dueDate && {
          nextReview: {
            lte: new Date(),
          },
        }),
      },
      orderBy: { updatedAt: 'desc' },
      ...paginationQuery(page, perPage),
      ...this.includeQuery,
    };

    const [data, totalItems] = await Promise.all([
      this.prisma.vocabulary.findMany(queryOptions),
      this.prisma.vocabulary.count({ where: queryOptions.where }),
    ]);

    return {
      data,
      pagination: calculatePagination(totalItems, query),
    };
  }

  async findOne(
    id: string,
    user: IAuthPayload,
  ): Promise<VocabularyResponseDto> {
    const vocabulary = await this.checkVocabularyPermission(id, user);
    return {
      data: vocabulary,
    };
  }

  async update(
    id: string,
    updateVocabularyDto: UpdateVocabularyDto,
    user: IAuthPayload,
  ): Promise<VocabularyResponseDto> {
    await this.checkVocabularyPermission(id, user);

    const updatedVocabulary = await this.prisma.vocabulary.update({
      where: { id },
      data: updateVocabularyDto,
      ...this.includeQuery,
    });

    return {
      data: updatedVocabulary,
    };
  }

  async remove(
    id: string,
    user: IAuthPayload,
  ): Promise<DeleteVocabularyResponse> {
    const vocabulary = await this.checkVocabularyPermission(id, user);

    if (vocabulary.practices.length > 0) {
      // Delete all related practices first
      await this.prisma.vocabularyPractice.deleteMany({
        where: {
          vocabularyId: id,
        },
      });
      // Then delete the vocabulary
      await this.prisma.vocabulary.delete({
        where: { id },
      });
    } else {
      // If no relations, just delete the vocabulary
      await this.prisma.vocabulary.delete({
        where: { id },
      });
    }

    return { message: 'Vocabulary deleted successfully' };
  }

  async getDueVocabularies(user: IAuthPayload): Promise<VocabulariesResponse> {
    if (!user) {
      throw new UnauthorizedException(
        'You must be logged in to get due vocabularies',
      );
    }

    const vocabularies = await this.prisma.vocabulary.findMany({
      where: {
        createdById: user.sub.toString(),
        nextReview: {
          lte: new Date(),
        },
      },
      ...this.includeQuery,
    });

    return {
      data: vocabularies,
      pagination: calculatePagination(vocabularies.length, {
        page: 1,
        perPage: vocabularies.length,
      }),
    };
  }

  async updateReviewStatus(
    id: string,
    dto: UpdateVocabularyReviewDto,
    user: IAuthPayload,
  ): Promise<VocabularyResponseDto> {
    const intervals = [1, 2, 4, 7, 15, 30, 60];
    const daysToAdd = intervals[dto.repetitionLevel] || 1;

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + daysToAdd);

    return this.update(
      id,
      { repetitionLevel: dto.repetitionLevel, nextReview },
      user,
    );
  }
}
