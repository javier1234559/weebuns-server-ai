import {
  CreateStudyActivityDto,
  StudyActivityDtoQuery,
} from '../dto/study-activity-request.dto';
import { ActivityDataResponse } from '../dto/study-activity-response.dto';

export interface IStudyActivityService {
  getActivitiesByMonth(
    userId: string,
    query: StudyActivityDtoQuery,
  ): Promise<ActivityDataResponse>;
  upsertActivity(userId: string, data: CreateStudyActivityDto): Promise<string>;
  deleteActivity(userId: string, date: string): Promise<string>;
}
