import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/models/user/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole, AuthProvider } from '@prisma/client';
import {
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MailService } from '../../../src/common/mail/mail.service';
import { PrismaService } from '../../../src/common/prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  const mockMailService = {
    sendPasswordResetEmail: jest.fn(),
  };

  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    const mockUser = {
      id: '1',
      email: registerDto.email,
      username: registerDto.username,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      role: UserRole.user,
      authProvider: AuthProvider.local,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    it('should register a new user successfully', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-token');
      mockConfigService.get.mockReturnValue('mock-secret');

      const result = await service.register(registerDto, mockResponse);

      expect(result).toEqual({
        access_token: 'mock-token',
        user: mockUser,
      });
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: registerDto.email,
          username: registerDto.username,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          role: UserRole.user,
          authProvider: AuthProvider.local,
          passwordHash: expect.any(String),
        }),
        include: {
          studentProfile: true,
          teacherProfile: true,
        },
      });
      expect(mockResponse.cookie).toHaveBeenCalled();
    });

    it('should throw ConflictException when email already exists', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      await expect(service.register(registerDto, mockResponse)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: '1',
      email: loginDto.email,
      username: 'testuser',
      passwordHash: bcrypt.hashSync('password123', 10),
      role: UserRole.user,
      authProvider: AuthProvider.local,
      isActive: true,
    };

    it('should login successfully with valid credentials', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-token');
      mockConfigService.get.mockReturnValue('mock-secret');

      const result = await service.login(loginDto, mockResponse);

      expect(result).toEqual({
        access_token: 'mock-token',
        user: mockUser,
      });
      expect(mockResponse.cookie).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto, mockResponse)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        passwordHash: bcrypt.hashSync('wrongpassword', 10),
      });

      await expect(service.login(loginDto, mockResponse)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when auth provider is not local', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        authProvider: AuthProvider.google,
      });

      await expect(service.login(loginDto, mockResponse)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshToken', () => {
    const mockRefreshToken = 'valid-refresh-token';
    const mockPayload = {
      sub: '1',
      email: 'test@example.com',
      role: UserRole.user,
    };

    it('should refresh token successfully', async () => {
      mockJwtService.verify.mockReturnValue(mockPayload);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: mockPayload.sub,
        email: mockPayload.email,
        role: mockPayload.role,
      });
      mockJwtService.sign.mockReturnValue('new-token');
      mockConfigService.get.mockReturnValue('mock-secret');

      const result = await service.refreshToken(mockRefreshToken, mockResponse);

      expect(result).toEqual({
        access_token: 'new-token',
        refresh_token: 'new-token',
      });
      expect(mockResponse.cookie).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(
        service.refreshToken(mockRefreshToken, mockResponse),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockJwtService.verify.mockReturnValue(mockPayload);
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.refreshToken(mockRefreshToken, mockResponse),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const result = await service.logout(mockResponse);

      expect(result).toEqual({
        message: 'Logged out successfully',
      });
      expect(mockResponse.clearCookie).toHaveBeenCalled();
    });
  });

  describe('requestPasswordReset', () => {
    const email = 'test@example.com';

    it('should request password reset successfully', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1', email });
      mockCacheManager.set.mockResolvedValue(undefined);
      mockMailService.sendPasswordResetEmail.mockResolvedValue(undefined);

      const result = await service.requestPasswordReset(email);

      expect(result).toEqual({
        message: 'Reset code sent to email',
      });
      expect(mockCacheManager.set).toHaveBeenCalled();
      expect(mockMailService.sendPasswordResetEmail).toHaveBeenCalled();
    });

    it('should throw BadRequestException when email does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.requestPasswordReset(email)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('verifyResetCode', () => {
    const email = 'test@example.com';
    const code = '123456';

    it('should verify reset code successfully', async () => {
      mockCacheManager.get.mockResolvedValue(code);
      mockCacheManager.set.mockResolvedValue(undefined);

      const result = await service.verifyResetCode(email, code);

      expect(result).toEqual({
        message: 'Code verified successfully',
      });
      expect(mockCacheManager.set).toHaveBeenCalled();
    });

    it('should throw BadRequestException when code is invalid', async () => {
      mockCacheManager.get.mockResolvedValue('654321');

      await expect(service.verifyResetCode(email, code)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when code is expired', async () => {
      mockCacheManager.get.mockResolvedValue(null);

      await expect(service.verifyResetCode(email, code)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('resetPassword', () => {
    const email = 'test@example.com';
    const code = '123456';
    const newPassword = 'newpassword123';

    it('should reset password successfully', async () => {
      mockCacheManager.get.mockResolvedValue(code);
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1', email });
      mockPrismaService.user.update.mockResolvedValue({ id: '1', email });
      mockCacheManager.del.mockResolvedValue(undefined);

      const result = await service.resetPassword(email, code, newPassword);

      expect(result).toEqual({
        message: 'Password reset successfully',
      });
      expect(mockPrismaService.user.update).toHaveBeenCalled();
      expect(mockCacheManager.del).toHaveBeenCalled();
    });

    it('should throw BadRequestException when code is invalid', async () => {
      mockCacheManager.get.mockResolvedValue('654321');

      await expect(
        service.resetPassword(email, code, newPassword),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when user not found', async () => {
      mockCacheManager.get.mockResolvedValue(code);
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.resetPassword(email, code, newPassword),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
