import {
  UserRole,
  ContentStatus,
  AuthProvider,
  PaymentType,
  PaymentStatus,
  SkillType,
  LessonType,
  SubmissionStatus,
  NotificationType,
  ReactionType,
  TokenTransactionType,
  FeatureCode,
  Prisma,
} from '@prisma/client';

export interface GeneratedIds {
  users: string[];
  teacherProfiles: string[];
  studentProfiles: string[];
  lessons: string[];
  lessonSubmissions: string[];
  vocabularies: string[];
  vocabularyPractices: string[];
  comments: string[];
  commentReactions: string[];
  notifications: string[];
  tokenTransactions: string[];
  referenceData: string[];
  discountCodes: string[];
}

export const generatedIds: GeneratedIds = {
  users: [],
  teacherProfiles: [],
  studentProfiles: [],
  lessons: [],
  lessonSubmissions: [],
  vocabularies: [],
  vocabularyPractices: [],
  comments: [],
  commentReactions: [],
  notifications: [],
  tokenTransactions: [],
  referenceData: [],
  discountCodes: [],
};

export const REFERENCE_TYPES = {
  LANGUAGE: 'language',
  LEVEL: 'level',
  TARGET: 'target',
  TOPIC: 'topic',
} as const;

export const referenceData: Prisma.ReferenceDataCreateInput[] = [
  {
    type: REFERENCE_TYPES.LEVEL,
    code: 'BEGINNER',
    name: 'Beginner',
    metadata: {
      description: 'Beginner level',
      recommended_level: 'BEGINNER',
    },
    isActive: true,
    orderIndex: 1,
  },
  {
    type: REFERENCE_TYPES.LEVEL,
    code: 'ELEMENTARY',
    name: 'Elementary',
    metadata: {
      description: 'Elementary level',
      recommended_level: 'ELEMENTARY',
    },
    isActive: true,
    orderIndex: 2,
  },
  {
    type: REFERENCE_TYPES.LEVEL,
    code: 'INTERMEDIATE',
    name: 'Intermediate',
    metadata: {
      description: 'Intermediate level',
      recommended_level: 'INTERMEDIATE',
    },
    isActive: true,
    orderIndex: 3,
  },
];

export const users: Prisma.UserCreateInput[] = [
  {
    username: 'test_user',
    email: 'test@gmail.com',
    passwordHash:
      '$2b$10$11zWAeJIiwBV7rI.TYlF4.nW/kLj67MvHs5j8BFcMeG9XgHXx8pci',
    role: UserRole.user,
    authProvider: AuthProvider.local,
    firstName: 'Student',
    lastName: 'One',
    profilePicture: 'https://example.com/student1.jpg',
    isEmailVerified: true,
    lastLogin: new Date(),
  },
  {
    username: 'teacher1',
    email: 'teacher@gmail.com',
    passwordHash:
      '$2b$10$11zWAeJIiwBV7rI.TYlF4.nW/kLj67MvHs5j8BFcMeG9XgHXx8pci',
    role: UserRole.teacher,
    authProvider: AuthProvider.local,
    firstName: 'Teacher',
    lastName: 'One',
    profilePicture: 'https://example.com/teacher1.jpg',
    isEmailVerified: true,
    lastLogin: new Date(),
  },
  {
    username: 'admin',
    email: 'admin@gmail.com',
    passwordHash:
      '$2b$10$11zWAeJIiwBV7rI.TYlF4.nW/kLj67MvHs5j8BFcMeG9XgHXx8pci',
    role: UserRole.admin,
    authProvider: AuthProvider.local,
    firstName: 'Admin',
    lastName: 'One',
    profilePicture: 'https://example.com/admin1.jpg',
    isEmailVerified: true,
    lastLogin: new Date(),
  },
];

export const createTeacherProfiles = (userIds: string[]) => [
  {
    user: {
      connect: {
        id: userIds[1],
      },
    },
    specialization: [SkillType.speaking, SkillType.writing],
    qualification: 'TESOL Certified, 5 years teaching experience',
    teachingExperience: 5,
    hourlyRate: 25,
  },
];

export const createStudentProfiles = (userIds: string[]) => [
  {
    user: {
      connect: {
        id: userIds[0],
      },
    },
    targetStudyDuration: 120,
    targetReading: 7.0,
    targetListening: 7.0,
    targetWriting: 6.5,
    targetSpeaking: 6.5,
    nextExamDate: new Date('2024-12-31'),
    tokensBalance: 100,
  },
];

export const createLessons = (userIds: string[], referenceDataId: string[]) => [
  {
    skill: SkillType.writing,
    title: 'IELTS Writing Task 2: Opinion Essay',
    description: 'Practice writing an opinion essay for IELTS Writing Task 2',
    lessonType: LessonType.practice,
    // level: REFERENCE.LEVELS.INTERMEDIATE,
    // levelType: REFERENCE.LEVELS.INTERMEDIATE,
    topic: 'EDUCATION',
    timeLimit: 40,
    content: {
      prompt:
        'Some people think that children should begin their formal education at a very early age and should spend most of their time on school studies. Others believe that young children should spend most of their time playing. Discuss both views and give your own opinion.',
      instructions: [
        'Write at least 250 words',
        'Structure your essay clearly with an introduction, body paragraphs and conclusion',
        'Support your arguments with examples and explanations',
      ],
    },
    status: ContentStatus.published,
    createdBy: {
      connect: {
        id: userIds[1],
      },
    },
    levelRef: {
      connect: {
        id: referenceDataId[0],
      },
    },
  },
];

export const createVocabularies = (userIds: string[]) => [
  {
    term: 'ubiquitous',
    meaning: ['present, appearing, or found everywhere'],
    exampleSentence: 'Mobile phones have become ubiquitous in modern society.',
    imageUrl: 'https://example.com/image.jpg',
    referenceLink: 'https://example.com/reference',
    referenceName: 'Reference Name',
    tags: ['academic', 'formal', 'IELTS'],
    repetitionLevel: 0,
    nextReview: new Date(),
    createdBy: {
      connect: {
        id: userIds[1],
      },
    },
  },
];

// export const comments: Prisma.CommentCreateInput[] = [
//     {
//         content: 'Great explanation! This really helped me understand the topic better.',
//         entityId: 'lesson-1',
//         user: {
//             connect: {
//                 username: 'test_user'
//             }
//         }
//     }
// ];

// export const notifications: Prisma.NotificationCreateInput[] = [
//     {
//         type: NotificationType.system,
//         title: 'Welcome to Weebuns!',
//         content: 'Welcome to our learning platform. Start your learning journey today!',
//         isGlobal: true,
//         createdBy: {
//             connect: {
//                 username: 'admin'
//             }
//         }
//     }
// ];

// export const featureTokenConfigs: Prisma.FeatureTokenConfigCreateInput[] = [
//     {
//         featureCode: FeatureCode.submission,
//         tokenCost: 10,
//         description: 'Submit writing or speaking practice for teacher review',
//         isActive: true
//     },
//     {
//         featureCode: FeatureCode.ai_chat,
//         tokenCost: 1,
//         description: 'Chat with AI tutor',
//         isActive: true
//     },
//     {
//         featureCode: FeatureCode.upgrade_suggestion,
//         tokenCost: 5,
//         description: 'Get AI suggestions to improve your writing/speaking',
//         isActive: true
//     }
// ];
