import { ApiProperty } from '@nestjs/swagger';
import {
  AuthProvider,
  UserRole,
  TeacherProfile,
  StudentProfile,
} from '@prisma/client';
import { IUser } from '../interface/user.interface';

export class TeacherProfileEntity implements TeacherProfile {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  userId: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  longBio: string | null;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  introVideoUrlEmbed: string | null;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  certifications: string | null;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  teachingExperience: string | null;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  other: string | null;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  deletedAt: Date | null;
}

export class StudentProfileEntity implements StudentProfile {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  userId: string;

  @ApiProperty({
    type: 'number',
    nullable: true,
  })
  targetStudyDuration: number | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
  })
  targetReading: number | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
  })
  targetListening: number | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
  })
  targetWriting: number | null;

  @ApiProperty({
    type: 'number',
    nullable: true,
  })
  targetSpeaking: number | null;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  nextExamDate: Date | null;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  deletedAt: Date | null;
}

export class User implements IUser {
  @ApiProperty({
    type: 'string',
    example: '00321d6f-2bcf-4985-9659-92a571275da6',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    type: 'string',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    type: 'string',
    example: '$2b$10$sOToCWV4/2hJjVo7TJSqOuUbRq8ZRxM6EdfXq1/cIfmBF.5z8L5MK',
  })
  passwordHash: string;

  @ApiProperty({
    enum: UserRole,
    enumName: 'UserRole',
    example: UserRole.user,
    description: 'User role in the system',
  })
  role: UserRole;

  @ApiProperty({
    enum: AuthProvider,
    enumName: 'AuthProvider',
    example: AuthProvider.local,
    description: 'Authentication provider used',
  })
  authProvider: AuthProvider;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  authProviderId: string | null;

  @ApiProperty({
    type: 'string',
    example: 'John',
    nullable: true,
  })
  firstName: string | null;

  @ApiProperty({
    type: 'string',
    example: 'Doe',
    nullable: true,
  })
  lastName: string | null;

  @ApiProperty({
    type: 'string',
    example: 'https://example.com/avatar.jpg',
    nullable: true,
  })
  profilePicture: string | null;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  bio: string | null;

  @ApiProperty({
    type: 'boolean',
    example: false,
  })
  isEmailVerified: boolean;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  lastLogin: Date | null;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
    description: 'Timestamp when the user was deleted (soft delete)',
  })
  deletedAt: Date | null;

  @ApiProperty({
    type: () => TeacherProfileEntity,
    nullable: true,
  })
  teacherProfile: TeacherProfileEntity | null;

  @ApiProperty({
    type: () => StudentProfileEntity,
    nullable: true,
  })
  studentProfile: StudentProfileEntity | null;
}
