import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthProvider, UserRole } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import {
  PaginationInputDto,
  PaginationOutputDto,
} from 'src/common/dto/pagination.dto';
import {
  StudentProfileEntity,
  TeacherProfileEntity,
  User,
} from 'src/models/user/entities/user.entity';

export class FindAllUserQuery extends PaginationInputDto {
  //docs
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  createdAt?: string;
}

export class UserDto implements Omit<User, 'passwordHash'> {
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

export class UserResponse {
  @ApiProperty({ type: UserDto, description: 'User details' })
  user: UserDto;
}

export class UsersResponse {
  @ApiProperty({ type: [UserDto], description: 'List of users' })
  data: UserDto[];
  @ApiProperty({ description: 'Pagination details' })
  pagination: PaginationOutputDto;
}

export class DeleteUserResponse {
  @ApiProperty()
  message: string;
}

export class CreateUserResponse {
  @ApiProperty({ type: UserDto })
  user: UserDto;
}
