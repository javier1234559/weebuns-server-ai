import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';

import { Cache } from 'cache-manager';
import { createHash } from 'crypto';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheKeyInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheKeyInterceptor.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const metadata = Reflect.getMetadata(
      'cache_key_metadata',
      context.getHandler(),
    );

    if (!metadata) {
      this.logger.debug('No cache metadata found');
      return next.handle();
    }

    const { prefix, ttl } = metadata;
    const request = context.switchToHttp().getRequest();
    const dto = request.body;

    // Generate cache key
    const keyString = Object.entries(dto)
      .map(([key, value]) => `${key}:${value}`)
      .sort()
      .join('-');
    const hash = createHash('md5').update(keyString).digest('hex');
    const cacheKey = prefix ? `${prefix}-${hash}` : hash;

    this.logger.debug(`Cache key: ${cacheKey}`);

    try {
      // Check cache
      const cachedData = await this.cacheManager.get(cacheKey);

      if (cachedData) {
        this.logger.debug(`Cache hit for key: ${cacheKey}`);
        return of(cachedData);
      }

      this.logger.debug(`Cache miss for key: ${cacheKey}`);

      // If no cache, execute handler and cache result
      return next.handle().pipe(
        tap(async (data) => {
          try {
            await this.cacheManager.set(cacheKey, data, { ttl });
            this.logger.debug(`Cached data for key: ${cacheKey}`);
          } catch (error) {
            this.logger.error(`Failed to cache data: ${error.message}`);
          }
        }),
      );
    } catch (error) {
      this.logger.error(`Cache error: ${error.message}`);
      return next.handle();
    }
  }
}
