import { ApiProperty } from '@nestjs/swagger';
import {
  $Enums,
  StudentProfile,
  TeacherProfile,
  UserRole,
} from '@prisma/client';
import {
  StudentProfileEntity,
  TeacherProfileEntity,
  User,
} from 'src/models/user/entities/user.entity';

export class UserDto implements Omit<User, 'passwordHash'> {
  @ApiProperty({
    example: '00321d6f-2bcf-4985-9659-92a571275da6',
    type: 'string',
  })
  id: string;

  @ApiProperty({
    example: 'john@example.com',
    type: 'string',
  })
  email: string;

  @ApiProperty({
    example: 'johndoe',
    type: 'string',
  })
  username: string;

  @ApiProperty({
    example: 'John',
    type: 'string',
    nullable: true,
  })
  firstName: string | null;

  @ApiProperty({
    example: 'Doe',
    type: 'string',
    nullable: true,
  })
  lastName: string | null;

  @ApiProperty({
    enum: UserRole,
    enumName: 'UserRole',
    example: UserRole.user,
  })
  role: UserRole;

  @ApiProperty({
    enum: $Enums.AuthProvider,
    enumName: 'AuthProvider',
    example: $Enums.AuthProvider.local,
  })
  authProvider: $Enums.AuthProvider;

  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  authProviderId: string | null;

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

  @ApiProperty({
    type: 'string',
    example: 'https://example.com/avatar.jpg',
    nullable: true,
  })
  profilePicture: string | null;

  @ApiProperty({
    type: () => TeacherProfileEntity,
    nullable: true,
  })
  teacherProfile: TeacherProfile | null;

  @ApiProperty({
    type: () => StudentProfileEntity,
    nullable: true,
  })
  studentProfile: StudentProfile | null;
}

export class UserLoginResponse {
  @ApiProperty()
  access_token: string;
  @ApiProperty({ type: UserDto })
  user: UserDto | null;
}

export class UserRegisterResponse {
  @ApiProperty()
  access_token: string;
  @ApiProperty({ type: UserDto })
  user: UserDto | null;
}

export class UserRefreshTokenResponse {
  @ApiProperty()
  access_token: string;
  @ApiProperty()
  refresh_token: string;
}

export class LogoutResponse {
  @ApiProperty({
    example: 'Logged out successfully',
    description: 'Status message',
  })
  message: string;
}

export class RequestResetPasswordResponse {
  @ApiProperty({
    example: 'Reset code sent to email',
    description: 'Status message',
  })
  message: string;
}

export class VerifyResetCodeResponse {
  @ApiProperty({
    example: 'Code verified successfully',
    description: 'Status message',
  })
  message: string;
}

export class ResetPasswordResponse {
  @ApiProperty({
    example: 'Password reset successfully',
    description: 'Status message',
  })
  message: string;
}

export class UserResponse {
  @ApiProperty({
    type: UserDto,
    description: 'User object',
  })
  user: UserDto | null;
}
