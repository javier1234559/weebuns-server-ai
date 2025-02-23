import { NotificationType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNotificationDto {
  @ApiProperty({
    enum: NotificationType,
    enumName: 'NotificationType',
    required: false,
  })
  type?: NotificationType;
  @ApiProperty({
    type: 'string',
    required: false,
  })
  title?: string;
  @ApiProperty({
    type: 'string',
    required: false,
  })
  content?: string;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  thumbnailUrl?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  actionUrl?: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true,
  })
  expiresAt?: Date | null;
}
