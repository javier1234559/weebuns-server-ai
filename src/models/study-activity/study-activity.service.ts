import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { IStudyActivityService } from './entities/study-activity.interface';
import {
  StudyActivityDtoQuery,
  CreateStudyActivityDto,
} from './dto/study-activity-request.dto';
import {
  ActivityDataResponse,
  ActivityData,
} from './dto/study-activity-response.dto';

@Injectable()
export class StudyActivityService implements IStudyActivityService {
  constructor(private readonly prisma: PrismaService) {}

  private formatTotalTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) {
      return `${remainingMinutes}m`;
    }
    return `${hours}h${remainingMinutes}m`;
  }

  private formatActivityData(activity: any): ActivityData {
    return {
      date: activity.date.toISOString().split('T')[0],
      reading: activity.reading,
      listening: activity.listening,
      writing: activity.writing,
      speaking: activity.speaking,
      total_time: this.formatTotalTime(activity.totalMinutes),
    };
  }

  async getActivitiesByMonth(
    userId: string,
    query: StudyActivityDtoQuery,
  ): Promise<ActivityDataResponse> {
    const { month, year } = query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const activities = await this.prisma.studyActivity.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    const formattedActivities = activities.reduce(
      (acc, activity) => {
        const formattedDate = activity.date.toISOString().split('T')[0];
        acc[formattedDate] = this.formatActivityData(activity);
        return acc;
      },
      {} as Record<string, ActivityData>,
    );

    return { data: formattedActivities };
  }

  async upsertActivity(
    userId: string,
    data: CreateStudyActivityDto,
  ): Promise<string> {
    const { date, reading, listening, writing, speaking, totalMinutes } = data;

    // First try to find existing activity
    const existingActivity = await this.prisma.studyActivity.findUnique({
      where: {
        userId_date: {
          userId,
          date: new Date(date),
        },
      },
    });

    if (existingActivity) {
      // If exists, update by adding new values
      const activity = await this.prisma.studyActivity.update({
        where: {
          userId_date: {
            userId,
            date: new Date(date),
          },
        },
        data: {
          reading: existingActivity.reading + (reading || 0),
          listening: existingActivity.listening + (listening || 0),
          writing: existingActivity.writing + (writing || 0),
          speaking: existingActivity.speaking + (speaking || 0),
          totalMinutes: existingActivity.totalMinutes + (totalMinutes || 0),
        },
      });
      return activity.id;
    } else {
      // If not exists, create new
      const activity = await this.prisma.studyActivity.create({
        data: {
          userId,
          date: new Date(date),
          reading: reading || 0,
          listening: listening || 0,
          writing: writing || 0,
          speaking: speaking || 0,
          totalMinutes: totalMinutes || 0,
        },
      });
      return activity.id;
    }
  }

  async deleteActivity(userId: string, date: string): Promise<string> {
    await this.prisma.studyActivity.delete({
      where: { userId_date: { userId, date: new Date(date) } },
    });
    return 'Activity deleted successfully';
  }
}
