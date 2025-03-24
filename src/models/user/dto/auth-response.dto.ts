import { ApiProperty } from '@nestjs/swagger';
import {
  $Enums,
  StudentProfile,
  TeacherProfile,
  UserRole,
} from '@prisma/client';
import { User } from 'src/models/user/entities/user.entity';

export class UserDto implements Omit<User, 'passwordHash'> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty({ nullable: true })
  firstName: string | null;

  @ApiProperty({ nullable: true })
  lastName: string | null;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty({ enum: $Enums.AuthProvider })
  authProvider: $Enums.AuthProvider;

  @ApiProperty({ nullable: true })
  authProviderId: string | null;

  @ApiProperty()
  isEmailVerified: boolean;

  @ApiProperty({ nullable: true })
  lastLogin: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  deletedAt: Date | null;

  @ApiProperty({ nullable: true })
  profilePicture: string | null;

  @ApiProperty({ nullable: true })
  teacherProfile: TeacherProfile | null;

  @ApiProperty({ nullable: true })
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
