import { AuthProvider, UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  username: string;
  @ApiProperty({
    type: 'string',
  })
  email: string;
  @ApiProperty({
    type: 'string',
  })
  passwordHash: string;
  @ApiProperty({
    enum: UserRole,
    enumName: 'UserRole',
  })
  role: UserRole;
  @ApiProperty({
    enum: AuthProvider,
    enumName: 'AuthProvider',
  })
  authProvider: AuthProvider;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  authProviderId: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  firstName: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  lastName: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  profilePicture: string | null;
  @ApiProperty({
    type: 'boolean',
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
}
