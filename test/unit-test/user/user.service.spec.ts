import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/models/user/user.service';
import { PrismaService } from '../../../src/common/prisma/prisma.service';
import { UserRole, AuthProvider, SkillType } from '@prisma/client';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  TeacherDto,
  ProfileDto,
} from '../../../src/models/user/dto/user-request.dto';

describe('UserService', () => {
  let service: UserService;

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTeacher', () => {
    const mockTeacherDto: TeacherDto = {
      username: 'teacher1',
      email: 'teacher1@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      specialization: [SkillType.reading, SkillType.writing],
      qualification: 'MA',
      teachingExperience: 5,
      hourlyRate: 50,
    };

    it('should create a new teacher successfully', async () => {
      const hashedPassword = await bcrypt.hash(mockTeacherDto.password, 10);
      const mockCreatedTeacher = {
        id: '1',
        ...mockTeacherDto,
        passwordHash: hashedPassword,
        role: UserRole.teacher,
        authProvider: AuthProvider.local,
        teacherProfile: {
          specialization: mockTeacherDto.specialization,
          qualification: mockTeacherDto.qualification,
          teachingExperience: mockTeacherDto.teachingExperience,
          hourlyRate: mockTeacherDto.hourlyRate,
        },
      };

      mockPrismaService.user.findFirst.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockCreatedTeacher);

      const result = await service.createTeacher(mockTeacherDto);

      expect(result.user).toBeDefined();
      expect(result.user?.role).toBe(UserRole.teacher);
      expect(result.user?.teacherProfile).toBeDefined();
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email or username exists', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue({ id: '1' });

      await expect(service.createTeacher(mockTeacherDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: UserRole.user,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findById('1');

      expect(result.user).toBeDefined();
      expect(result.user?.id).toBe('1');
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          teacherProfile: true,
          studentProfile: true,
        },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    const mockQuery = {
      page: 1,
      perPage: 10,
      search: 'test',
    };

    it('should return paginated users', async () => {
      const mockUsers = [
        { id: '1', username: 'testuser1' },
        { id: '2', username: 'testuser2' },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);
      mockPrismaService.user.count.mockResolvedValue(2);

      const result = await service.findAll(mockQuery);

      expect(result.data).toHaveLength(2);
      expect(result.pagination).toBeDefined();
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
      expect(mockPrismaService.user.count).toHaveBeenCalled();
    });
  });

  describe('updateProfileTeacher', () => {
    const mockProfileDto: ProfileDto = {
      specialization: [SkillType.reading, SkillType.writing],
      qualification: 'PhD',
      teachingExperience: 10,
      hourlyRate: 100,
    };

    it('should update teacher profile successfully', async () => {
      const mockTeacher = {
        id: '1',
        role: UserRole.teacher,
        teacherProfile: null,
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockTeacher);
      mockPrismaService.user.update.mockResolvedValue({
        ...mockTeacher,
        teacherProfile: mockProfileDto,
      });

      const result = await service.updateProfileTeacher('1', mockProfileDto);

      expect(result.user).toBeDefined();
      expect(result.user?.teacherProfile).toBeDefined();
      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if teacher not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(
        service.updateProfileTeacher('1', mockProfileDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfileStudent', () => {
    const mockProfileDto: ProfileDto = {
      targetStudyDuration: 120,
      targetReading: 80,
      targetListening: 80,
      targetWriting: 80,
      targetSpeaking: 80,
      nextExamDate: new Date(),
    };

    it('should update student profile successfully', async () => {
      const mockStudent = {
        id: '1',
        role: UserRole.user,
        studentProfile: null,
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockStudent);
      mockPrismaService.user.update.mockResolvedValue({
        ...mockStudent,
        studentProfile: mockProfileDto,
      });

      const result = await service.updateProfileStudent('1', mockProfileDto);

      expect(result.user).toBeDefined();
      expect(result.user?.studentProfile).toBeDefined();
      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if student not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(
        service.updateProfileStudent('1', mockProfileDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a user successfully', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        deletedAt: new Date(),
      });

      const result = await service.remove('1');

      expect(result.message).toBe('User deleted successfully');
      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
