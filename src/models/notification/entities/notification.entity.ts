import { ApiProperty } from '@nestjs/swagger';
import { INotification } from '../interface/notification-interface';
import { NotificationType } from '@prisma/client';

export class Notification implements INotification {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: NotificationType;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  thumbnailUrl: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  actionUrl: string | null;

  @ApiProperty()
  isGlobal: boolean;

  @ApiProperty()
  userId: string | null;

  @ApiProperty()
  isRead: boolean;

  @ApiProperty()
  createdById: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  expiresAt: Date | null;
}
