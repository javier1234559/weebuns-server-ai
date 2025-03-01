import { NotificationType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationDto {
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
    type: 'boolean',
  })
  isRead: boolean;
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
}
