export enum LanguageCode {
  ENGLISH = 'ENGLISH',
  VIETNAMESE = 'VIETNAMESE',
}

export const ISO_TO_LANGUAGE_CODE: Record<string, LanguageCode> = {
  en: LanguageCode.ENGLISH,
  'en-US': LanguageCode.ENGLISH,
  'en-GB': LanguageCode.ENGLISH,
  vi: LanguageCode.VIETNAMESE,
  'vi-VN': LanguageCode.VIETNAMESE,
} as const;

export enum LevelCode {
  BEGINNER = 'BEGINNER',
  ELEMENTARY = 'ELEMENTARY',
  INTERMEDIATE = 'INTERMEDIATE',
  UPPER_INTERMEDIATE = 'UPPER_INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  MASTER = 'MASTER',
}

export enum TargetCode {
  COMMUNICATION = 'COMMUNICATION',
  IELTS = 'IELTS',
  TOEIC = 'TOEIC',
  OTHER = 'OTHER',
}

export enum TopicCode {
  BUSINESS = 'BUSINESS',
  ACADEMIC = 'ACADEMIC',
  TRAVEL = 'TRAVEL',
  DAILY_LIFE = 'DAILY_LIFE',
  TECHNOLOGY = 'TECHNOLOGY',
  OTHER = 'OTHER',
}

export enum RepetitionLevel {
  NEW = 0, // First time
  LEVEL_1 = 1, // Review after 1 day
  LEVEL_2 = 2, // Review after 3 days
  LEVEL_3 = 3, // Review after 7 days
  LEVEL_4 = 4, // Review after 14 days
  LEVEL_5 = 5, // Review after 30 days
  MASTERED = 6, // Review after 90 days
}

export enum SubscriptionStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum TransactionType {
  TOKEN_PURCHASE = 'token_purchase',
  TOKEN_USE = 'token_use',
}
