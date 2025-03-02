import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
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
    type: 'string',
    required: false,
    nullable: true,
  })
  authProviderId?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  firstName?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  lastName?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  profilePicture?: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true,
  })
  lastLogin?: Date | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true,
  })
  deletedAt?: Date | null;
}
