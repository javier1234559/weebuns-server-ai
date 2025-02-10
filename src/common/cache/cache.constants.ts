export const CACHE_TTL = {
  SPACES: 3600, // 1 hour
  AI_TRANSLATIONS: 86400, // 24 hours
  AI_GRAMMAR: 86400, // 24 hours
  AI_TOPICS: 3600, // 1 hour
};

export const CACHE_KEYS = {
  SPACES: (id?: string) => `spaces:${id || 'all'}`,
  AI_TRANSLATIONS: (text: string, from: string, to: string) =>
    `translations:${from}:${to}:${text.substring(0, 50)}`,
  AI_GRAMMAR: (text: string) => `grammar:${text.substring(0, 50)}`,
  AI_TOPICS: (category?: string) => `topics:${category || 'all'}`,
};

// src/common/decorators/cache/constants.ts
export const CACHE_KEY_METADATA = 'cache_key_metadata';

// src/common/decorators/cache/interfaces.ts
export interface CacheKeyMetadata {
  prefix: string;
  ttl: number;
}
