import { NotificationType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
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
