import { PaginationOutputDto } from 'src/common/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Notification } from '../entities/notification.entity';

export class NotificationResponse {
  @ApiProperty({ type: [Notification] })
  data: Notification[];

  @ApiProperty()
  pagination: PaginationOutputDto;
}
