import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsStatsDto {
  @ApiProperty({
    description: 'Type of stats (circulating, total_supply, commission, user)',
    example: 'circulating',
  })
  type: string;

  @ApiProperty({
    description: 'Current value',
    example: 125000,
  })
  value: number;

  @ApiProperty({
    description: 'Description of the value',
    example: '125.000.000 VND',
  })
  description: string;

  @ApiProperty({
    description: 'Changed value today',
    example: '+200 token',
  })
  changedValue: string;

  @ApiProperty({
    description: 'Last update time',
    example: '2024-04-23T15:30:45Z',
  })
  updateTime: string;
}

export class AnalyticsResponse {
  @ApiProperty({ type: AnalyticsStatsDto })
  circulatingStats: AnalyticsStatsDto;

  @ApiProperty({ type: AnalyticsStatsDto })
  totalSupplyStats: AnalyticsStatsDto;

  @ApiProperty({ type: AnalyticsStatsDto })
  commissionStats: AnalyticsStatsDto;

  @ApiProperty({ type: AnalyticsStatsDto })
  userStats: AnalyticsStatsDto;
}

export class StatsResponse {
  @ApiProperty({
    description: 'The total number of lessons',
    example: 100,
  })
  totalLessons: number;

  @ApiProperty({
    description: 'The total number of submissions',
    example: 100,
  })
  totalSubmissions: number;
}
