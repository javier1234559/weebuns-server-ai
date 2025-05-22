import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { StudyActivityService } from './study-activity.service';
import {
  CreateStudyActivityDto,
  StudyActivityDtoQuery,
} from './dto/study-activity-request.dto';
import { ActivityDataResponse } from './dto/study-activity-response.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('study-activity')
@Controller('study-activity')
export class StudyActivityController {
  constructor(private readonly studyActivityService: StudyActivityService) {}

  @Get(':userId')
  @ApiResponse({
    status: 200,
    description: 'Get activities by month',
    type: ActivityDataResponse,
  })
  getActivitiesByMonth(
    @Param('userId') userId: string,
    @Query() query: StudyActivityDtoQuery,
  ): Promise<ActivityDataResponse> {
    return this.studyActivityService.getActivitiesByMonth(userId, query);
  }

  @Post(':userId')
  @ApiResponse({
    status: 200,
    description: 'Upsert activity',
    type: String,
  })
  upsertActivity(
    @Param('userId') userId: string,
    @Body() body: CreateStudyActivityDto,
  ): Promise<string> {
    return this.studyActivityService.upsertActivity(userId, body);
  }

  @Delete(':userId/:date')
  @ApiResponse({
    status: 200,
    description: 'Delete activity',
    type: String,
  })
  deleteActivity(
    @Param('userId') userId: string,
    @Param('date') date: string,
  ): Promise<string> {
    return this.studyActivityService.deleteActivity(userId, date);
  }
}
