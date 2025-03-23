import { ApiProperty } from '@nestjs/swagger';
import {
  AuthProvider,
  UserRole,
  TeacherProfile,
  StudentProfile,
  SkillType,
} from '@prisma/client';
import { IUser } from '../interface/user.interface';
import { Decimal } from '@prisma/client/runtime/library';

export class TeacherProfileEntity implements TeacherProfile {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: SkillType, isArray: true })
  specialization: SkillType[];

  @ApiProperty({ nullable: true })
  qualification: string | null;

  @ApiProperty({ nullable: true })
  teachingExperience: number | null;

  @ApiProperty({ nullable: true })
  hourlyRate: Decimal | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  deletedAt: Date | null;
}

export class StudentProfileEntity implements StudentProfile {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ nullable: true })
  targetStudyDuration: number | null;

  @ApiProperty({ nullable: true })
  targetReading: number | null;

  @ApiProperty({ nullable: true })
  targetListening: number | null;

  @ApiProperty({ nullable: true })
  targetWriting: number | null;

  @ApiProperty({ nullable: true })
  targetSpeaking: number | null;

  @ApiProperty({ nullable: true })
  nextExamDate: Date | null;

  @ApiProperty()
  tokensBalance: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  deletedAt: Date | null;
}

export class User implements IUser {
  @ApiProperty({
    example: '00321d6f-2bcf-4985-9659-92a571275da6',
  })
  id: string;

  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({
    example: '$2b$10$sOToCWV4/2hJjVo7TJSqOuUbRq8ZRxM6EdfXq1/cIfmBF.5z8L5MK',
  })
  passwordHash: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.user,
    description: 'User role in the system',
  })
  role: UserRole;

  @ApiProperty({
    enum: AuthProvider,
    example: AuthProvider.local,
    description: 'Authentication provider used',
  })
  authProvider: AuthProvider;

  @ApiProperty({
    nullable: true,
  })
  authProviderId: string | null;

  @ApiProperty({
    example: 'John',
    nullable: true,
  })
  firstName: string | null;

  @ApiProperty({
    example: 'Doe',
    nullable: true,
  })
  lastName: string | null;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    nullable: true,
  })
  profilePicture: string | null;

  @ApiProperty({
    example: false,
  })
  isEmailVerified: boolean;

  @ApiProperty({
    nullable: true,
  })
  lastLogin: Date | null;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    nullable: true,
    description: 'Timestamp when the user was deleted (soft delete)',
  })
  deletedAt: Date | null;

  @ApiProperty({ type: () => TeacherProfileEntity, nullable: true })
  teacherProfile: TeacherProfile | null;

  @ApiProperty({ type: () => StudentProfileEntity, nullable: true })
  studentProfile: StudentProfile | null;
}
