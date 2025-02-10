import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable, tap } from 'rxjs';

import { IAuthPayload } from 'src/common/interface/auth-payload.interface';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class ActivityInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  private readonly fixedPaths = [
    '/api/essays',
    '/api/notes',
    '/api/vocabularies',
  ];

  private readonly pathPatterns = [
    /^\/api\/courses\/[^/]+\/progress$/, // Matches /api/courses/{any-id}/progress
  ];

  private isTrackablePath(path: string): boolean {
    return (
      this.fixedPaths.some((fixedPath) => path.startsWith(fixedPath)) ||
      this.pathPatterns.some((pattern) => pattern.test(path))
    );
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as IAuthPayload;
    const userId = String(user?.sub);
    return next.handle().pipe(
      tap(async () => {
        try {
          if (
            userId &&
            ['POST', 'PUT', 'PATCH'].includes(request.method) &&
            this.isTrackablePath(request.path)
          ) {
            await this.trackActivity(userId);
          }
        } catch (error) {
          console.error('❌ Activity tracking error:', error);
        }
      }),
    );
  }

  private async trackActivity(userId: string) {
    try {
      // Get today's activity if exists
      const [todayActivity] = await this.prisma.$queryRaw<
        Array<{ id: string; activity_count: number; streak_count: number }>
      >`
        SELECT *
        FROM user_activities
        WHERE user_id = ${userId}::uuid
          AND DATE_TRUNC('day', time) = DATE_TRUNC('day', NOW())
        LIMIT 1;
      `;

      if (todayActivity) {
        // Update today's activity count
        await this.prisma.$executeRaw`
          UPDATE user_activities
          SET activity_count = activity_count + 1
          WHERE user_id = ${userId}::uuid
            AND DATE_TRUNC('day', time) = DATE_TRUNC('day', NOW());
        `;
        console.log('Updated activity count for today');
      } else {
        // Check yesterday's activity for streak
        const [yesterdayActivity] = await this.prisma.$queryRaw<
          Array<{ streak_count: number }>
        >`
          SELECT streak_count
          FROM user_activities
          WHERE user_id = ${userId}::uuid
            AND DATE_TRUNC('day', time) = DATE_TRUNC('day', NOW() - INTERVAL '1 day')
          LIMIT 1;
        `;

        const newStreakCount = yesterdayActivity
          ? yesterdayActivity.streak_count + 1
          : 1;

        // Create new activity for today
        await this.prisma.$executeRaw`
          INSERT INTO user_activities (
            time,
            user_id,
            activity_count,
            streak_count
          )
          VALUES (
            NOW(),
            ${userId}::uuid,
            1,
            ${newStreakCount}
          );
        `;
        console.log('Created new activity for today');
      }
    } catch (error) {
      console.error('Error in trackActivity:', error);
      throw error;
    }
  }
}
