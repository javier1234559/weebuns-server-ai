import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { Roles, UserRole } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/auth/auth.guard';
import { RolesGuard } from 'src/common/auth/role.guard';
import {
  CreateNotificationDto,
  FindAllNotificationQuery,
} from './dto/notification-request.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { IAuthPayload } from 'src/common/interface/auth-payload.interface';
import { NotificationResponse } from './dto/notification-response.dto';

@Controller('notifications')
@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  @Roles(UserRole.ADMIN)
  @ApiResponse({ status: 200, type: String })
  async sendNotification(
    @CurrentUser() user: IAuthPayload,
    @Body() data: CreateNotificationDto,
  ): Promise<string> {
    const createdBy = String(user.sub);
    return this.notificationService.sendNotification(createdBy, data);
  }

  @Get('')
  @Roles(UserRole.USER, UserRole.TEACHER, UserRole.ADMIN)
  @ApiResponse({ status: 200, type: NotificationResponse })
  async getUserNotifications(
    @Query() query: FindAllNotificationQuery,
  ): Promise<NotificationResponse> {
    return this.notificationService.getAll(query);
  }

  @Patch(':id/read')
  @Roles(UserRole.USER, UserRole.TEACHER, UserRole.ADMIN)
  @ApiResponse({ status: 200, type: String })
  async markAsRead(@Param('id') id: string): Promise<string> {
    return this.notificationService.markAsRead(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiResponse({ status: 200, type: String })
  async deleteNotification(@Param('id') id: string): Promise<string> {
    return this.notificationService.deleteNotification(id);
  }
}
