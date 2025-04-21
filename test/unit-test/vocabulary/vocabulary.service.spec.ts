import { Test, TestingModule } from '@nestjs/testing';
import { VocabularyService } from '../../../src/models/vocabulary/vocabulary.service';
import { PrismaService } from '../../../src/common/prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserRole } from '../../../src/common/decorators/role.decorator';
import { CreateVocabularyDto } from '../../../src/models/vocabulary/dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from '../../../src/models/vocabulary/dto/update-vocabulary.dto';
import { VocabularyFilterDto } from '../../../src/models/vocabulary/dto/vocabulary-filter.dto';
import { PaginationInputDto } from '../../../src/common/dto/pagination.dto';
import { AuthProvider } from '@prisma/client';
import { IAuthPayload } from '../../../src/common/interface/auth-payload.interface';

describe('VocabularyService', () => {
  let service: VocabularyService;

  const mockPrismaService = {
    vocabulary: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockUser: IAuthPayload = {
    sub: '123',
    email: 'user@example.com',
    role: UserRole.USER.toString(),
    iat: 1234567890,
    exp: 1234567890,
  };

  const mockAdminUser: IAuthPayload = {
    sub: '456',
    email: 'admin@example.com',
    role: UserRole.ADMIN.toString(),
    iat: 1234567890,
    exp: 1234567890,
  };

  const mockTeacherUser: IAuthPayload = {
    sub: '789',
    email: 'teacher@example.com',
    role: UserRole.TEACHER.toString(),
    iat: 1234567890,
    exp: 1234567890,
  };

  const mockCreatedBy = {
    id: '123',
    username: 'testuser',
    email: 'user@example.com',
    passwordHash: 'hashedpassword',
    role: UserRole.USER,
    authProvider: AuthProvider.local,
    authProviderId: null,
    firstName: 'Test',
    lastName: 'User',
    profilePicture: null,
    isEmailVerified: true,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockVocabulary = {
    id: 'vocabulary-123',
    term: 'Test Term',
    meaning: ['Test Meaning'],
    exampleSentence: 'This is a test sentence',
    imageUrl: 'https://example.com/image.jpg',
    referenceLink: 'https://example.com/reference',
    referenceName: 'Test Reference',
    tags: ['test'],
    repetitionLevel: 0,
    nextReview: new Date(),
    createdById: '123',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: mockCreatedBy,
    practices: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VocabularyService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<VocabularyService>(VocabularyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const mockCreateVocabularyDto: CreateVocabularyDto = {
      term: 'Test Term',
      meaning: ['Test Meaning'],
      exampleSentence: 'This is a test sentence',
      imageUrl: 'https://example.com/image.jpg',
      referenceLink: 'https://example.com/reference',
      referenceName: 'Test Reference',
      tags: ['test'],
      repetitionLevel: 0,
      nextReview: new Date(),
    };

    it('should create a vocabulary', async () => {
      mockPrismaService.vocabulary.create.mockResolvedValue(mockVocabulary);

      const result = await service.create(mockCreateVocabularyDto, mockUser);

      expect(result).toEqual(mockVocabulary);
      expect(mockPrismaService.vocabulary.create).toHaveBeenCalledWith({
        data: {
          ...mockCreateVocabularyDto,
          createdById: mockUser.sub,
        },
        include: {
          createdBy: true,
          practices: true,
        },
      });
    });
  });

  describe('findAll', () => {
    const mockPaginationDto: PaginationInputDto = {
      page: 1,
      perPage: 10,
    };

    const mockVocabularies = [mockVocabulary];

    it('should find all vocabularies for a regular user', async () => {
      mockPrismaService.vocabulary.findMany.mockResolvedValue(mockVocabularies);
      mockPrismaService.vocabulary.count.mockResolvedValue(1);

      const result = await service.findAll(mockPaginationDto, mockUser);

      expect(result.data).toEqual(mockVocabularies);
      expect(result.pagination).toEqual({
        total: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      });
      expect(mockPrismaService.vocabulary.findMany).toHaveBeenCalledWith({
        where: {
          createdById: mockUser.sub,
        },
        skip: 0,
        take: 10,
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          createdBy: true,
          practices: true,
        },
      });
    });

    it('should find all vocabularies for an admin', async () => {
      mockPrismaService.vocabulary.findMany.mockResolvedValue(mockVocabularies);
      mockPrismaService.vocabulary.count.mockResolvedValue(1);

      const result = await service.findAll(mockPaginationDto, mockAdminUser);

      expect(result.data).toEqual(mockVocabularies);
      expect(result.pagination).toEqual({
        total: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      });
      expect(mockPrismaService.vocabulary.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          createdBy: true,
          practices: true,
        },
      });
    });

    it('should filter vocabularies by tags', async () => {
      const mockFilters: VocabularyFilterDto = {
        tags: ['test'],
      };

      mockPrismaService.vocabulary.findMany.mockResolvedValue(mockVocabularies);
      mockPrismaService.vocabulary.count.mockResolvedValue(1);

      const result = await service.findAll(
        mockPaginationDto,
        mockUser,
        mockFilters,
      );

      expect(result.data).toEqual(mockVocabularies);
      expect(result.pagination).toEqual({
        total: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      });
      expect(mockPrismaService.vocabulary.findMany).toHaveBeenCalledWith({
        where: {
          createdById: mockUser.sub,
          tags: {
            hasSome: ['test'],
          },
        },
        skip: 0,
        take: 10,
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          createdBy: true,
          practices: true,
        },
      });
    });

    it('should filter vocabularies by term', async () => {
      const mockFilters: VocabularyFilterDto = {
        term: 'Test Term',
      };

      mockPrismaService.vocabulary.findMany.mockResolvedValue(mockVocabularies);
      mockPrismaService.vocabulary.count.mockResolvedValue(1);

      const result = await service.findAll(
        mockPaginationDto,
        mockUser,
        mockFilters,
      );

      expect(result.data).toEqual(mockVocabularies);
      expect(result.pagination).toEqual({
        total: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      });
      expect(mockPrismaService.vocabulary.findMany).toHaveBeenCalledWith({
        where: {
          createdById: mockUser.sub,
          term: {
            contains: 'Test Term',
            mode: 'insensitive',
          },
        },
        skip: 0,
        take: 10,
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          createdBy: true,
          practices: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should find a vocabulary by id for the creator', async () => {
      mockPrismaService.vocabulary.findUnique.mockResolvedValue(mockVocabulary);

      const result = await service.findOne('vocabulary-123', mockUser);

      expect(result).toEqual(mockVocabulary);
      expect(mockPrismaService.vocabulary.findUnique).toHaveBeenCalledWith({
        where: { id: 'vocabulary-123' },
        include: {
          createdBy: true,
          practices: true,
        },
      });
    });

    it('should find a vocabulary by id for an admin', async () => {
      mockPrismaService.vocabulary.findUnique.mockResolvedValue(mockVocabulary);

      const result = await service.findOne('vocabulary-123', mockAdminUser);

      expect(result).toEqual(mockVocabulary);
      expect(mockPrismaService.vocabulary.findUnique).toHaveBeenCalledWith({
        where: { id: 'vocabulary-123' },
        include: {
          createdBy: true,
          practices: true,
        },
      });
    });

    it('should throw NotFoundException when vocabulary is not found', async () => {
      mockPrismaService.vocabulary.findUnique.mockResolvedValue(null);

      await expect(
        service.findOne('non-existent-id', mockAdminUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the creator or admin', async () => {
      mockPrismaService.vocabulary.findUnique.mockResolvedValue(mockVocabulary);

      await expect(
        service.findOne('vocabulary-123', mockTeacherUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    const mockUpdateVocabularyDto: UpdateVocabularyDto = {
      term: 'Updated Term',
      meaning: ['Updated Meaning'],
      tags: ['updated', 'test'],
    };

    it('should update a vocabulary for the creator', async () => {
      mockPrismaService.vocabulary.findUnique.mockResolvedValue(mockVocabulary);
      mockPrismaService.vocabulary.update.mockResolvedValue({
        ...mockVocabulary,
        ...mockUpdateVocabularyDto,
        updatedAt: new Date(),
      });

      const result = await service.update(
        'vocabulary-123',
        mockUpdateVocabularyDto,
        mockUser,
      );

      expect(result).toEqual({
        ...mockVocabulary,
        ...mockUpdateVocabularyDto,
        updatedAt: expect.any(Date),
      });
      expect(mockPrismaService.vocabulary.update).toHaveBeenCalledWith({
        where: { id: 'vocabulary-123' },
        data: mockUpdateVocabularyDto,
        include: {
          createdBy: true,
          practices: true,
        },
      });
    });

    it('should update a vocabulary for an admin', async () => {
      mockPrismaService.vocabulary.findUnique.mockResolvedValue(mockVocabulary);
      mockPrismaService.vocabulary.update.mockResolvedValue({
        ...mockVocabulary,
        ...mockUpdateVocabularyDto,
        updatedAt: new Date(),
      });

      const result = await service.update(
        'vocabulary-123',
        mockUpdateVocabularyDto,
        mockAdminUser,
      );

      expect(result).toEqual({
        ...mockVocabulary,
        ...mockUpdateVocabularyDto,
        updatedAt: expect.any(Date),
      });
      expect(mockPrismaService.vocabulary.update).toHaveBeenCalledWith({
        where: { id: 'vocabulary-123' },
        data: mockUpdateVocabularyDto,
        include: {
          createdBy: true,
          practices: true,
        },
      });
    });

    it('should throw ForbiddenException if user is not the creator or admin', async () => {
      mockPrismaService.vocabulary.findUnique.mockResolvedValue(mockVocabulary);

      await expect(
        service.update(
          'vocabulary-123',
          mockUpdateVocabularyDto,
          mockTeacherUser,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove a vocabulary for the creator', async () => {
      mockPrismaService.vocabulary.findUnique.mockResolvedValue(mockVocabulary);
      mockPrismaService.vocabulary.delete.mockResolvedValue(mockVocabulary);

      const result = await service.remove('vocabulary-123', mockUser);

      expect(result).toEqual({ message: 'Vocabulary deleted successfully' });
      expect(mockPrismaService.vocabulary.delete).toHaveBeenCalledWith({
        where: { id: 'vocabulary-123' },
      });
    });

    it('should remove a vocabulary for an admin', async () => {
      mockPrismaService.vocabulary.findUnique.mockResolvedValue(mockVocabulary);
      mockPrismaService.vocabulary.delete.mockResolvedValue(mockVocabulary);

      const result = await service.remove('vocabulary-123', mockAdminUser);

      expect(result).toEqual({ message: 'Vocabulary deleted successfully' });
      expect(mockPrismaService.vocabulary.delete).toHaveBeenCalledWith({
        where: { id: 'vocabulary-123' },
      });
    });

    it('should throw ForbiddenException if user is not the creator or admin', async () => {
      mockPrismaService.vocabulary.findUnique.mockResolvedValue(mockVocabulary);

      await expect(
        service.remove('vocabulary-123', mockTeacherUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getDueVocabularies', () => {
    const mockDueVocabularies = [mockVocabulary];

    it('should get due vocabularies for a user', async () => {
      mockPrismaService.vocabulary.findMany.mockResolvedValue(
        mockDueVocabularies,
      );

      const result = await service.getDueVocabularies(mockUser);

      expect(result).toEqual(mockDueVocabularies);
      expect(mockPrismaService.vocabulary.findMany).toHaveBeenCalledWith({
        where: {
          createdById: mockUser.sub,
          nextReview: {
            lte: expect.any(Date),
          },
        },
        include: {
          createdBy: true,
          practices: true,
        },
      });
    });
  });

  describe('updateReviewStatus', () => {
    it('should update review status for a vocabulary', async () => {
      const updatedVocabulary = {
        ...mockVocabulary,
        repetitionLevel: 1,
        nextReview: new Date(),
        updatedAt: new Date(),
      };

      const updateSpy = jest
        .spyOn(service, 'update')
        .mockResolvedValue(updatedVocabulary);

      const result = await service.updateReviewStatus(
        'vocabulary-123',
        1,
        mockUser,
      );

      expect(result).toEqual(updatedVocabulary);
      expect(updateSpy).toHaveBeenCalledWith(
        'vocabulary-123',
        {
          repetitionLevel: 1,
          nextReview: expect.any(Date),
        },
        mockUser,
      );
    });
  });
});
