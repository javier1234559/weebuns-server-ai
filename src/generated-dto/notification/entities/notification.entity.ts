import { NotificationType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

export class Notification {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    enum: NotificationType,
    enumName: 'NotificationType',
  })
  type: NotificationType;
  @ApiProperty({
    type: 'string',
  })
  title: string;
  @ApiProperty({
    type: 'string',
  })
  content: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  thumbnailUrl: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  actionUrl: string | null;
  @ApiProperty({
    type: 'boolean',
  })
  isGlobal: boolean;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  userId: string | null;
  @ApiProperty({
    type: 'boolean',
  })
  isRead: boolean;
  @ApiProperty({
    type: 'string',
  })
  createdById: string;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  expiresAt: Date | null;
  @ApiProperty({
    type: () => User,
    required: false,
    nullable: true,
  })
  user?: User | null;
  @ApiProperty({
    type: () => User,
    required: false,
  })
  createdBy?: User;
}
