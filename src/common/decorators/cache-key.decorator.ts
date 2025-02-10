// // cache-key.decorator.ts
// import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
// import { applyDecorators } from '@nestjs/common';
// import { createHash } from 'crypto';
// export function CacheKeyDto(prefix: string = '', ttl: number = 86400) {
//   return applyDecorators(
//     (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
//       const originalMethod = descriptor.value;
//       descriptor.value = async function (...args: any[]) {
//         const dto = args[0];
//         const keyString = Object.entries(dto)
//           .map(([key, value]) => `${key}:${value}`)
//           .sort()
//           .join('-');
//         const hash = createHash('md5').update(keyString).digest('hex');
//         const cacheKey = prefix ? `${prefix}-${hash}` : hash;
//         // Apply both cache key and TTL
//         CacheKey(cacheKey)(target, propertyKey, descriptor);
//         CacheTTL(ttl)(target, propertyKey, descriptor);
//         return originalMethod.apply(this, args);
//       };
//       return descriptor;
//     },
//   );
// }
// src/common/decorators/cache/cache-key.decorator.ts
import { SetMetadata } from '@nestjs/common';

import {
  CACHE_KEY_METADATA,
  CacheKeyMetadata,
} from 'src/common/cache/cache.constants';

export function CacheKeyDto(prefix: string = '', ttl: number = 86400) {
  return SetMetadata<string, CacheKeyMetadata>(CACHE_KEY_METADATA, {
    prefix,
    ttl,
  });
}
