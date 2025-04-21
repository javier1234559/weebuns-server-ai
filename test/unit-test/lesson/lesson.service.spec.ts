import { Test, TestingModule } from '@nestjs/testing';
import { LessonService } from '../../../src/models/lesson/lesson.service';
import { PrismaService } from '../../../src/common/prisma/prisma.service';
import { ContentStatus, LessonType, SkillType } from '@prisma/client';
import {
  CreateReadingDTO,
  UpdateReadingDTO,
} from '../../../src/models/lesson/dto/lesson-request.dto';

describe('LessonService', () => {
  let service: LessonService;

  const mockPrismaService = {
    lesson: {
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LessonService>(LessonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createReading', () => {
    const mockCreateReadingDto: CreateReadingDTO = {
      title: 'Test Reading Lesson',
      description: 'Test Description',
      lessonType: LessonType.practice,
      level: 'A1',
      topic: 'Test Topic',
      timeLimit: 30,
      tags: ['test'],
      thumbnailUrl: 'http://example.com/image.jpg',
      status: ContentStatus.draft,
      createdById: 'user-123',
      content: {
        text: 'Sample reading text',
        questions: [
          {
            id: '1',
            question: 'What is this?',
            right_answer: 'A test',
            answer_list: [{ answer: 'A test' }, { answer: 'Not a test' }],
          },
        ],
      },
    };

    const mockCreatedLesson = {
      id: 'lesson-123',
      ...mockCreateReadingDto,
      skill: SkillType.reading,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null as Date | null,
      submissions: [],
    };

    it('should create a reading lesson', async () => {
      mockPrismaService.lesson.create.mockResolvedValue(mockCreatedLesson);

      const result = await service.createReading(mockCreateReadingDto);

      expect(result.data).toEqual({
        ...mockCreatedLesson,
        content: mockCreateReadingDto.content,
      });
      expect(mockPrismaService.lesson.create).toHaveBeenCalledWith({
        data: {
          ...mockCreateReadingDto,
          skill: SkillType.reading,
          createdById: mockCreateReadingDto.createdById,
          content: mockCreateReadingDto.content,
        },
        include: {
          submissions: true,
        },
      });
    });
  });

  describe('updateReading', () => {
    const mockUpdateReadingDto: UpdateReadingDTO = {
      title: 'Updated Reading Lesson',
      description: 'Updated Description',
      lessonType: LessonType.practice,
      level: 'A1',
      topic: 'Updated Topic',
      timeLimit: 45,
      tags: ['updated'],
      thumbnailUrl: 'http://example.com/updated.jpg',
      status: ContentStatus.published,
      content: {
        text: 'Updated reading text',
        questions: [
          {
            id: '1',
            question: 'What is this?',
            right_answer: 'An updated test',
            answer_list: [
              { answer: 'An updated test' },
              { answer: 'Not an updated test' },
            ],
          },
        ],
      },
    };

    const mockExistingLesson = {
      id: 'lesson-123',
      skill: SkillType.reading,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null as Date | null,
    };

    const mockUpdatedLesson = {
      id: 'lesson-123',
      ...mockUpdateReadingDto,
      skill: SkillType.reading,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null as Date | null,
      submissions: [],
    };

    it('should update a reading lesson', async () => {
      mockPrismaService.lesson.findFirst.mockResolvedValue(mockExistingLesson);
      mockPrismaService.lesson.update.mockResolvedValue(mockUpdatedLesson);

      const result = await service.updateReading(
        'lesson-123',
        mockUpdateReadingDto,
      );

      expect(result.data).toEqual({
        ...mockUpdatedLesson,
        content: mockUpdateReadingDto.content,
      });
      expect(mockPrismaService.lesson.update).toHaveBeenCalledWith({
        where: { id: 'lesson-123' },
        data: {
          ...mockUpdateReadingDto,
          skill: SkillType.reading,
          content: mockUpdateReadingDto.content,
        },
        include: {
          submissions: true,
        },
      });
    });

    it('should throw NotFoundException if lesson not found', async () => {
      mockPrismaService.lesson.findFirst.mockResolvedValue(null);

      await expect(
        service.updateReading('lesson-123', mockUpdateReadingDto),
      ).rejects.toThrow('Reading lesson with ID lesson-123 not found');
    });
  });

  describe('delete', () => {
    const mockLesson = {
      id: 'lesson-123',
      submissions: [],
    };

    it('should soft delete a lesson with no submissions', async () => {
      mockPrismaService.lesson.findFirst.mockResolvedValue(mockLesson);
      mockPrismaService.lesson.update.mockResolvedValue({
        ...mockLesson,
        deletedAt: new Date(),
      });

      const result = await service.delete('lesson-123');

      expect(result).toEqual({ message: 'Lesson deleted successfully' });
      expect(mockPrismaService.lesson.update).toHaveBeenCalledWith({
        where: { id: 'lesson-123' },
        data: expect.any(Object),
      });
    });

    it('should hard delete a lesson with submissions', async () => {
      const mockLessonWithSubmissions = {
        ...mockLesson,
        submissions: [{ id: 'submission-1' }],
      };
      mockPrismaService.lesson.findFirst.mockResolvedValue(
        mockLessonWithSubmissions,
      );
      mockPrismaService.lesson.delete.mockResolvedValue(
        mockLessonWithSubmissions,
      );

      const result = await service.delete('lesson-123');

      expect(result).toEqual({ message: 'Lesson deleted successfully' });
      expect(mockPrismaService.lesson.delete).toHaveBeenCalledWith({
        where: { id: 'lesson-123' },
      });
    });

    it('should throw NotFoundException if lesson not found', async () => {
      mockPrismaService.lesson.findFirst.mockResolvedValue(null);

      await expect(service.delete('lesson-123')).rejects.toThrow(
        'Lesson with ID lesson-123 not found',
      );
    });
  });
});
