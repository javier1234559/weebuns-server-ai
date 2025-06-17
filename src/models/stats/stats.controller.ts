import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { StatsResponse, AnalyticsResponse } from './dto/stats-response.dto';
import { AuthGuard } from 'src/common/auth/auth.guard';
import { RolesGuard } from 'src/common/auth/role.guard';
import { Roles, UserRole } from 'src/common/decorators/role.decorator';

@Controller('stats')
@ApiTags('stats')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get general stats' })
  @ApiResponse({
    status: 200,
    description: 'Return general stats',
    type: StatsResponse,
  })
  getStats(): Promise<StatsResponse> {
    return this.statsService.getStats();
  }

  @Get('analytics')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get analytics data' })
  @ApiResponse({
    status: 200,
    description: 'Return analytics data',
    type: AnalyticsResponse,
  })
  getAnalytics(): Promise<AnalyticsResponse> {
    return this.statsService.getAnalytics();
  }
}
