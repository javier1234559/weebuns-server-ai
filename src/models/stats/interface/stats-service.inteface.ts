import { StatsResponse } from '../dto/stats-response.dto';
import { AnalyticsResponse } from '../dto/stats-response.dto';

export interface IStatsService {
  getStats(): Promise<StatsResponse>;
  getAnalytics(): Promise<AnalyticsResponse>;
}
