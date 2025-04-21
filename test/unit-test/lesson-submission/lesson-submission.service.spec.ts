import { Test, TestingModule } from '@nestjs/testing';
import { LessonSubmissionService } from '../../../src/models/lesson-submission/lesson-submission.service';
import { PrismaService } from '../../../src/common/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { SkillType, SubmissionStatus } from '@prisma/client';
import { serializeJSON } from '../../../src/common/utils/format';

describe('LessonSubmissionService', () => {
  let service: LessonSubmissionService;

  const mockPrismaService = {
    lessonSubmission: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    lesson: {
      findFirst: jest.fn(),
    },
  };

  const mockAnswer = {
    id: 'a1',
    answer: 'Answer A',
    isCorrect: true,
  };

  const mockQuestion = {
    id: 'q1',
    question: 'Test question?',
    selected_answer: 'A',
    right_answer: 'A',
    answer_list: [mockAnswer],
    is_bookmark: false,
  };

  const mockUserData = {
    id: 'user-1',
    instruction: 'Write an essay about...',
    body1: 'First paragraph...',
    body2: 'Second paragraph...',
    conclusion: 'Conclusion paragraph...',
  };

  const mockCorrection = {
    id: 'c1',
    sentence: 'This is a test sentence.',
    error: 'grammar',
    suggestion: 'This is a test sentence!',
    reason: 'Missing punctuation',
  };

  const mockWritingFeedback = {
    overall_score: 8,
    task_response: 7,
    coherence_cohesion: 8,
    lexical_resource: 9,
    grammar: 8,
    corrections: [mockCorrection],
    overall_feedback: 'Good essay with clear structure',
  };

  const mockSubmission = {
    id: 'submission-1',
    userId: 'user-1',
    lessonId: 'lesson-1',
    submissionType: SkillType.reading,
    status: SubmissionStatus.completed,
    content: serializeJSON({
      text: 'Sample reading text',
      questions: [mockQuestion],
    }),
    feedback: serializeJSON({
      totalQuestions: 1,
      correctAnswers: 1,
      incorrectAnswers: 0,
      accuracy: 100,
    }),
    tokensUsed: 10,
    submittedAt: new Date(),
    gradedAt: null,
    gradedById: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    lesson: {
      id: 'lesson-1',
      title: 'Test Lesson',
    },
    user: {
      id: 'user-1',
      username: 'testuser',
    },
    gradedBy: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonSubmissionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LessonSubmissionService>(LessonSubmissionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllSubmissions', () => {
    it('should return paginated submissions', async () => {
      const query = {
        page: 1,
        perPage: 10,
        userId: 'user-1',
        lessonId: 'lesson-1',
        submissionType: SkillType.reading,
        status: SubmissionStatus.completed,
        search: 'test',
      };

      mockPrismaService.lessonSubmission.findMany.mockResolvedValue([
        mockSubmission,
      ]);
      mockPrismaService.lessonSubmission.count.mockResolvedValue(1);

      const result = await service.findAllSubmissions(query);

      expect(result.data).toHaveLength(1);
      expect(result.pagination).toBeDefined();
      expect(mockPrismaService.lessonSubmission.findMany).toHaveBeenCalled();
      expect(mockPrismaService.lessonSubmission.count).toHaveBeenCalled();
    });
  });

  describe('getAllSubmissionsByUser', () => {
    it('should return user submissions', async () => {
      const userId = 'user-1';
      const query = {
        page: 1,
        perPage: 10,
        submissionType: SkillType.reading,
        status: SubmissionStatus.completed,
        search: 'test',
      };

      mockPrismaService.lessonSubmission.findMany.mockResolvedValue([
        mockSubmission,
      ]);
      mockPrismaService.lessonSubmission.count.mockResolvedValue(1);

      const result = await service.getAllSubmissionsByUser(userId, query);

      expect(result.data).toHaveLength(1);
      expect(result.pagination).toBeDefined();
      expect(mockPrismaService.lessonSubmission.findMany).toHaveBeenCalled();
      expect(mockPrismaService.lessonSubmission.count).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete submission', async () => {
      const id = 'submission-1';
      mockPrismaService.lessonSubmission.findFirst.mockResolvedValue(
        mockSubmission,
      );
      mockPrismaService.lessonSubmission.update.mockResolvedValue({
        ...mockSubmission,
        deletedAt: new Date(),
      });

      const result = await service.delete(id);

      expect(result.message).toBe('Submission deleted successfully');
      expect(mockPrismaService.lessonSubmission.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if submission not found', async () => {
      const id = 'non-existent';
      mockPrismaService.lessonSubmission.findFirst.mockResolvedValue(null);

      await expect(service.delete(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneReadingSubmission', () => {
    it('should return reading submission', async () => {
      const id = 'submission-1';
      mockPrismaService.lessonSubmission.findFirst.mockResolvedValue(
        mockSubmission,
      );

      const result = await service.findOneReadingSubmission(id);

      expect(result.data).toBeDefined();
      expect(result.data.submissionType).toBe(SkillType.reading);
      expect(mockPrismaService.lessonSubmission.findFirst).toHaveBeenCalled();
    });

    it('should throw NotFoundException if submission not found', async () => {
      const id = 'non-existent';
      mockPrismaService.lessonSubmission.findFirst.mockResolvedValue(null);

      await expect(service.findOneReadingSubmission(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createReadingSubmission', () => {
    it('should create reading submission', async () => {
      const userId = 'user-1';
      const dto = {
        lessonId: 'lesson-1',
        submissionType: SkillType.reading,
        tokensUsed: 10,
        content: {
          text: 'Sample reading text',
          questions: [mockQuestion],
        },
      };

      mockPrismaService.lessonSubmission.create.mockResolvedValue(
        mockSubmission,
      );

      const result = await service.createReadingSubmission(userId, dto);

      expect(result.data).toBeDefined();
      expect(result.data.submissionType).toBe(SkillType.reading);
      expect(mockPrismaService.lessonSubmission.create).toHaveBeenCalled();
    });
  });

  describe('findOneListeningSubmission', () => {
    it('should return listening submission', async () => {
      const id = 'submission-1';
      const listeningSubmission = {
        ...mockSubmission,
        submissionType: SkillType.listening,
        content: serializeJSON({
          audio_url: 'test-audio.mp3',
          question_list: [mockQuestion],
        }),
      };

      mockPrismaService.lessonSubmission.findFirst.mockResolvedValue(
        listeningSubmission,
      );

      const result = await service.findOneListeningSubmission(id);

      expect(result.data).toBeDefined();
      expect(result.data.submissionType).toBe(SkillType.listening);
      expect(mockPrismaService.lessonSubmission.findFirst).toHaveBeenCalled();
    });

    it('should throw NotFoundException if submission not found', async () => {
      const id = 'non-existent';
      mockPrismaService.lessonSubmission.findFirst.mockResolvedValue(null);

      await expect(service.findOneListeningSubmission(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createListeningSubmission', () => {
    it('should create listening submission', async () => {
      const userId = 'user-1';
      const dto = {
        lessonId: 'lesson-1',
        submissionType: SkillType.listening,
        tokensUsed: 10,
        content: {
          audio_url: 'test-audio.mp3',
          question_list: [mockQuestion],
        },
      };

      const listeningSubmission = {
        ...mockSubmission,
        submissionType: SkillType.listening,
        content: serializeJSON(dto.content),
      };

      mockPrismaService.lessonSubmission.create.mockResolvedValue(
        listeningSubmission,
      );

      const result = await service.createListeningSubmission(userId, dto);

      expect(result.data).toBeDefined();
      expect(result.data.submissionType).toBe(SkillType.listening);
      expect(mockPrismaService.lessonSubmission.create).toHaveBeenCalled();
    });
  });

  describe('findOneSpeakingSubmission', () => {
    it('should return speaking submission', async () => {
      const id = 'submission-1';
      const speakingSubmission = {
        ...mockSubmission,
        submissionType: SkillType.speaking,
        content: serializeJSON({
          topic_text: 'Test topic',
          prompt_text: 'Test prompt',
          chat_history: [],
          audioUrl: 'test-audio.mp3',
          transcript: 'Test transcript',
        }),
      };

      mockPrismaService.lessonSubmission.findFirst.mockResolvedValue(
        speakingSubmission,
      );

      const result = await service.findOneSpeakingSubmission(id);

      expect(result.data).toBeDefined();
      expect(result.data.submissionType).toBe(SkillType.speaking);
      expect(mockPrismaService.lessonSubmission.findFirst).toHaveBeenCalled();
    });

    it('should throw NotFoundException if submission not found', async () => {
      const id = 'non-existent';
      mockPrismaService.lessonSubmission.findFirst.mockResolvedValue(null);

      await expect(service.findOneSpeakingSubmission(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createSpeakingSubmission', () => {
    it('should create speaking submission', async () => {
      const userId = 'user-1';
      const dto = {
        lessonId: 'lesson-1',
        submissionType: SkillType.speaking,
        tokensUsed: 10,
        content: {
          topic_text: 'Test topic',
          prompt_text: 'Test prompt',
          chat_history: [],
          audioUrl: 'test-audio.mp3',
          transcript: 'Test transcript',
        },
      };

      const speakingSubmission = {
        ...mockSubmission,
        submissionType: SkillType.speaking,
        content: serializeJSON(dto.content),
      };

      mockPrismaService.lessonSubmission.create.mockResolvedValue(
        speakingSubmission,
      );

      const result = await service.createSpeakingSubmission(userId, dto);

      expect(result.data).toBeDefined();
      expect(result.data.submissionType).toBe(SkillType.speaking);
      expect(mockPrismaService.lessonSubmission.create).toHaveBeenCalled();
    });
  });

  describe('findOneWritingSubmission', () => {
    it('should return writing submission with example essay', async () => {
      const id = 'submission-1';
      const writingSubmission = {
        ...mockSubmission,
        submissionType: SkillType.writing,
        content: serializeJSON({
          user_data: mockUserData,
          lesson_id: 'lesson-1',
          chat_history: [],
          essay: 'Test essay content',
        }),
        feedback: serializeJSON(mockWritingFeedback),
      };

      const mockLesson = {
        id: 'lesson-1',
        skill: SkillType.writing,
        content: serializeJSON({
          resources: {
            sample_essay: {
              title: 'Sample Essay',
              content: 'Sample essay content',
            },
          },
        }),
      };

      mockPrismaService.lessonSubmission.findFirst.mockResolvedValue(
        writingSubmission,
      );
      mockPrismaService.lesson.findFirst.mockResolvedValue(mockLesson);

      const result = await service.findOneWritingSubmission(id);

      expect(result.data).toBeDefined();
      expect(result.data.submissionType).toBe(SkillType.writing);
      expect(result.exampleEssay).toBeDefined();
      expect(mockPrismaService.lessonSubmission.findFirst).toHaveBeenCalled();
      expect(mockPrismaService.lesson.findFirst).toHaveBeenCalled();
    });

    it('should throw NotFoundException if submission not found', async () => {
      const id = 'non-existent';
      mockPrismaService.lessonSubmission.findFirst.mockResolvedValue(null);

      await expect(service.findOneWritingSubmission(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createWritingSubmission', () => {
    it('should create writing submission', async () => {
      const userId = 'user-1';
      const dto = {
        lessonId: 'lesson-1',
        submissionType: SkillType.writing,
        tokensUsed: 10,
        content: {
          user_data: mockUserData,
          lesson_id: 'lesson-1',
          chat_history: [],
          essay: 'Test essay content',
        },
      };

      const writingSubmission = {
        ...mockSubmission,
        submissionType: SkillType.writing,
        content: serializeJSON(dto.content),
        status: SubmissionStatus.submitted,
      };

      mockPrismaService.lessonSubmission.create.mockResolvedValue(
        writingSubmission,
      );

      const result = await service.createWritingSubmission(userId, dto);

      expect(result.data).toBeDefined();
      expect(result.data.submissionType).toBe(SkillType.writing);
      expect(result.data.status).toBe(SubmissionStatus.submitted);
      expect(mockPrismaService.lessonSubmission.create).toHaveBeenCalled();
    });
  });

  describe('updateWritingSubmission', () => {
    it('should update writing submission', async () => {
      const id = 'submission-1';
      const userId = 'user-1';
      const dto = {
        lessonId: 'lesson-1',
        submissionType: SkillType.writing,
        tokensUsed: 10,
        content: {
          user_data: mockUserData,
          lesson_id: 'lesson-1',
          chat_history: [],
          essay: 'Updated essay content',
        },
        feedback: mockWritingFeedback,
      };

      const writingSubmission = {
        ...mockSubmission,
        submissionType: SkillType.writing,
        content: serializeJSON(dto.content),
        feedback: serializeJSON(dto.feedback),
        status: SubmissionStatus.scored,
        gradedAt: new Date(),
        gradedById: userId,
      };

      mockPrismaService.lessonSubmission.findFirst.mockResolvedValue(
        writingSubmission,
      );
      mockPrismaService.lessonSubmission.update.mockResolvedValue(
        writingSubmission,
      );

      const result = await service.updateWritingSubmission(id, userId, dto);

      expect(result.data).toBeDefined();
      expect(result.data.submissionType).toBe(SkillType.writing);
      expect(result.data.status).toBe(SubmissionStatus.scored);
      expect(mockPrismaService.lessonSubmission.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if submission not found', async () => {
      const id = 'non-existent';
      const userId = 'user-1';
      const dto = {
        lessonId: 'lesson-1',
        submissionType: SkillType.writing,
        tokensUsed: 10,
        content: {
          user_data: mockUserData,
          lesson_id: 'lesson-1',
          chat_history: [],
          essay: 'Updated essay content',
        },
      };

      mockPrismaService.lessonSubmission.findFirst.mockResolvedValue(null);

      await expect(
        service.updateWritingSubmission(id, userId, dto),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
