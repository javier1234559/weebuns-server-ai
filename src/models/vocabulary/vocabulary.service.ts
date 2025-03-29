import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserRole } from 'src/common/decorators/role.decorator';
import { PaginationInputDto } from 'src/common/dto/pagination.dto';
import { IAuthPayload } from 'src/common/interface/auth-payload.interface';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateVocabularyDto } from 'src/models/vocabulary/dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from 'src/models/vocabulary/dto/update-vocabulary.dto';

@Injectable()
export class VocabularyService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly includeQuery = {
    createdBy: true,
    practices: true,
  };

  async create(createVocabularyDto: CreateVocabularyDto, user: IAuthPayload) {
    return this.prisma.vocabulary.create({
      data: {
        ...createVocabularyDto,
        createdById: user.sub.toString(),
      },
      include: this.includeQuery,
    });
  }

  async findAll(
    paginationDto: PaginationInputDto,
    user: IAuthPayload,
    filters?: { tags?: string[]; term?: string },
  ) {
    const { page = 1, perPage = 10 } = paginationDto || {};
    const skip = (page - 1) * perPage;

    // Build where conditions
    const where: Prisma.VocabularyWhereInput = {};

    // Filter by tags if provided
    if (filters?.tags && filters.tags.length > 0) {
      where.tags = {
        hasSome: filters.tags,
      };
    }

    // Filter by term if provided
    if (filters?.term) {
      where.term = {
        contains: filters.term,
        mode: 'insensitive',
      };
    }

    // Only admins can see all vocabularies
    // Teachers and users can only see their own
    if (user.role !== UserRole.ADMIN.toString()) {
      where.createdById = user.sub.toString();
    }

    const [data, total] = await Promise.all([
      this.prisma.vocabulary.findMany({
        where,
        skip,
        take: perPage,
        orderBy: {
          updatedAt: 'desc',
        },
        include: this.includeQuery,
      }),
      this.prisma.vocabulary.count({ where }),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async findOne(id: string, user: IAuthPayload) {
    const vocabulary = await this.prisma.vocabulary.findUnique({
      where: { id },
      include: this.includeQuery,
    });

    if (!vocabulary) {
      throw new NotFoundException(`Vocabulary with ID ${id} not found`);
    }

    // Check if user has permission to access this vocabulary
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

  async update(
    id: string,
    updateVocabularyDto: UpdateVocabularyDto,
    user: IAuthPayload,
  ) {
    // First check if vocabulary exists and user has permission
    const vocabulary = await this.findOne(id, user);

    // Only the creator or admin can update
    if (
      user.role !== UserRole.ADMIN.toString() &&
      vocabulary.createdById !== user.sub.toString()
    ) {
      throw new ForbiddenException(
        'You do not have permission to update this vocabulary',
      );
    }

    return this.prisma.vocabulary.update({
      where: { id },
      data: updateVocabularyDto,
      include: this.includeQuery,
    });
  }

  async remove(id: string, user: IAuthPayload) {
    // First check if vocabulary exists and user has permission
    const vocabulary = await this.findOne(id, user);

    // Only the creator or admin can delete
    if (
      user.role !== UserRole.ADMIN.toString() &&
      vocabulary.createdById !== user.sub.toString()
    ) {
      throw new ForbiddenException(
        'You do not have permission to delete this vocabulary',
      );
    }

    await this.prisma.vocabulary.delete({
      where: { id },
    });

    return { message: 'Vocabulary deleted successfully' };
  }

  async getDueVocabularies(user: IAuthPayload) {
    return this.prisma.vocabulary.findMany({
      where: {
        createdById: user.sub.toString(),
        nextReview: {
          lte: new Date(),
        },
      },
      include: this.includeQuery,
    });
  }

  async updateReviewStatus(
    id: string,
    repetitionLevel: number,
    user: IAuthPayload,
  ) {
    // Calculate next review date based on spaced repetition algorithm
    // Using Supermemo-2 algorithm intervals: [1, 2, 4, 7, 15, 30, 60]
    const intervals = [1, 2, 4, 7, 15, 30, 60];
    const daysToAdd = intervals[repetitionLevel] || 1;

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + daysToAdd);

    return this.update(id, { repetitionLevel, nextReview }, user);
  }
}
