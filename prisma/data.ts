import {
  UserRole,
  ContentStatus,
  AuthProvider,
  SkillType,
  LessonType,
  Prisma,
  NotificationType,
  StudyActivity,
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
  studyActivities: string[];
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
  studyActivities: [],
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
    code: 'beginner',
    name: 'Beginner',
    metadata: {
      description: 'Beginner level',
      recommended_level: 'Beginner',
    },
    isActive: true,
    orderIndex: 1,
  },
  {
    type: REFERENCE_TYPES.LEVEL,
    code: 'intermediate',
    name: 'Intermediate',
    metadata: {
      description: 'Intermediate level',
      recommended_level: 'INTERMEDIATE',
    },
    isActive: true,
    orderIndex: 2,
  },
  {
    type: REFERENCE_TYPES.LEVEL,
    code: 'advanced',
    name: 'Advanced',
    metadata: {
      description: 'Advanced level',
      recommended_level: 'Advanced',
    },
    isActive: true,
    orderIndex: 3,
  },
  {
    type: REFERENCE_TYPES.TOPIC,
    code: 'ielts',
    name: 'IELTS',
    metadata: {
      description: 'IELTS topic',
      recommended_level: 'IELTS',
    },
    isActive: true,
    orderIndex: 4,
  },
  {
    type: REFERENCE_TYPES.TOPIC,
    code: 'toeic',
    name: 'TOEIC',
    metadata: {
      description: 'TOEIC topic',
      recommended_level: 'TOEIC',
    },
    isActive: true,
    orderIndex: 5,
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
      '$2b$10$11zWAeJIiwBV7rI.TYlF4.nW/kLj67MvHs5j8BFcMeG9XgHXx8pci', //securePass123
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
      '$2b$10$11zWAeJIiwBV7rI.TYlF4.nW/kLj67MvHs5j8BFcMeG9XgHXx8pci', //123456
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

export const createLessons = (userIds: string[]) => [
  {
    skill: SkillType.writing,
    title: 'IELTS Writing Task 2: Opinion Essay',
    description: 'Practice writing an opinion essay for IELTS Writing Task 2',
    lessonType: LessonType.practice,
    level: 'intermediate',
    topic: 'ielts',
    thumbnailUrl:
      'https://img.freepik.com/free-photo/english-books-resting-table-working-space_23-2149429616.jpg?semt=ais_hybrid',
    timeLimit: 40,
    content: {
      text: 'Some people think that children should begin their formal education at a very early age and should spend most of their time on school studies. Others believe that young children should spend most of their time playing. Discuss both views and give your own opinion.',
      promptAI:
        'Act as an IELTS writing task 2 expert. You will be given a task and you need to write a task 2 essay for the task. The task is to write an opinion essay for IELTS Writing Task 2. The essay should be 250 words long. The essay should be written in a formal and academic style. The essay should be written in a way that is easy to understand.',
      instructions:
        'Write at least 250 words. Structure your essay clearly with an introduction, body paragraphs and conclusion. Support your arguments with examples and explanations.',
    },
    status: ContentStatus.published,
    createdById: userIds[1],
  },
  {
    skill: SkillType.reading,
    title: 'IELTS Reading Task 2: Opinion Essay',
    description: 'Practice reading an opinion essay for IELTS Reading Task 2',
    lessonType: LessonType.practice,
    level: 'intermediate',
    thumbnailUrl:
      'https://img.freepik.com/free-photo/english-books-resting-table-working-space_23-2149429616.jpg?semt=ais_hybrid',
    topic: 'ielts',
    timeLimit: 40,
    content: {
      text: `Lucas goes to school every day of the week. He has many subjects to go to each school day: English, art, science, mathematics, gym, and history. His mother packs a big backpack full of books and lunch for Lucas.
His first class is English, and he likes that teacher very much. His English teacher says that he is a good pupil, which Lucas knows means that she thinks he is a good student.
His next class is art. He draws on paper with crayons and pencils and sometimes uses a ruler. Lucas likes art. It is his favorite class.
His third class is science. This class is very hard for Lucas to figure out, but he gets to work with his classmates a lot, which he likes to do. His friend, Kyle, works with Lucas in science class, and they have fun.
Then Lucas gets his break for lunch. He sits with Kyle while he eats. The principal, or the headmaster as some call him, likes to walk around and talk to students during lunch to check that they are all behaving.
The next class is mathematics, which most of the students just call math. Kyle has trouble getting a good grade in mathematics, but the teacher is very nice and helpful.
His fourth class is gym. It is just exercising.
History is his last class of the day. Lucas has a hard time staying awake. Many lessons are boring, and he is very tired after doing gym.`,
      questions: [
        {
          id: '12',
          question: 'Which one is true ?',
          right_answer: 'true',
          answer_list: [
            {
              answer: 'false2',
            },
            {
              answer: 'false1',
            },
            {
              answer: 'false3',
            },
            {
              answer: 'true',
            },
          ],
          is_bookmark: true,
          selected_answer: 'true',
        },
      ],
    },
    status: ContentStatus.published,
    createdById: userIds[1],
  },
  {
    skill: SkillType.listening,
    title: 'IELTS Listening Task 2: Opinion Essay',
    description:
      'Practice listening an opinion essay for IELTS Listening Task 2',
    lessonType: LessonType.practice,
    level: 'intermediate',
    topic: 'ielts',
    thumbnailUrl:
      'https://img.freepik.com/free-photo/english-books-resting-table-working-space_23-2149429616.jpg?semt=ais_hybrid',
    timeLimit: 40,
    content: {
      audio_url:
        'https://ubp4bdepbl.ufs.sh/f/fkClDhMQd7TEhczv4c20jGCrUK3yIO18HXvFLsN7Wm5MwPha',
      questions: [
        {
          id: '12',
          question: 'Which one is true ?',
          right_answer: 'true',
          answer_list: [
            {
              answer: 'false2',
            },
            {
              answer: 'false1',
            },
            {
              answer: 'false3',
            },
            {
              answer: 'true',
            },
          ],
          is_bookmark: true,
          selected_answer: 'true',
        },
      ],
    },
    status: ContentStatus.published,
    createdById: userIds[1],
  },
  {
    skill: SkillType.speaking,
    title: 'IELTS Speaking : Talk about your favorite food',
    description:
      'Practice speaking about your favorite food for IELTS Speaking',
    lessonType: LessonType.practice,
    level: 'intermediate',
    topic: 'ielts',
    thumbnailUrl:
      'https://img.freepik.com/free-photo/english-books-resting-table-working-space_23-2149429616.jpg?semt=ais_hybrid',
    timeLimit: 40,
    content: {
      text: 'Talk about your favorite food',
      promptAI:
        'Act as an IELTS speaking task 2 expert. You will be given a task and you need to speak about your favorite food for IELTS Speaking Task 2. The task is to speak about your favorite food for IELTS Speaking Task 2. The essay should be 250 words long. The essay should be written in a formal and academic style. The essay should be written in a way that is easy to understand.',
      instructions:
        'Write at least 250 words. Structure your essay clearly with an introduction, body paragraphs and conclusion. Support your arguments with examples and explanations.',
    },
    status: ContentStatus.published,
    createdById: userIds[1],
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
    repetitionLevel: 0,
    nextReview: new Date(),
    createdBy: {
      connect: {
        id: userIds[1],
      },
    },
  },
];

export const createComments = (userIds: string[]) => [
  {
    identifierId: 'writing-all',
    content: 'Bài viết này rất hữu ích, cảm ơn tác giả!',
    userId: userIds[0],
  },
  {
    identifierId: 'writing-all',
    content: 'Tôi cũng thấy bài viết này rất hay!',
    userId: userIds[0],
    parentId: 'comment-1',
  },
];

export const createNotifications = (userIds: string[]) => [
  // System notification
  {
    type: NotificationType.system,
    title: 'Chào mừng đến với Weebuns!',
    content:
      'Chúng tôi rất vui được chào đón bạn đến với cộng đồng học tập của chúng tôi.',
    thumbnailUrl: 'https://example.com/welcome.jpg',
    isGlobal: true,
    createdById: userIds[2], // Admin user
  },
  // Advertisement notification
  {
    type: NotificationType.advertisement,
    title: 'Khóa học IELTS mới!',
    content:
      'Đăng ký ngay khóa học IELTS mới với ưu đãi 20% cho 100 người đầu tiên.',
    thumbnailUrl: 'https://example.com/ielts-course.jpg',
    actionUrl: '/courses/ielts',
    isGlobal: true,
    createdById: userIds[2],
  },
  // Submission notification
  {
    type: NotificationType.submission,
    title: 'Bài tập của bạn đã được chấm điểm',
    content: 'Giáo viên đã chấm điểm bài viết IELTS Writing Task 2 của bạn.',
    thumbnailUrl: 'https://example.com/submission.jpg',
    actionUrl: '/submissions/1',
    userId: userIds[0],
    createdById: userIds[1], // Teacher user
  },
  // Comment reply notification
  {
    type: NotificationType.comment_reply,
    title: 'Ai đó đã trả lời bình luận của bạn',
    content: 'Bạn đã nhận được một phản hồi cho bình luận của mình.',
    thumbnailUrl: 'https://example.com/comment.jpg',
    actionUrl: '/comments/1',
    userId: userIds[0],
    createdById: userIds[0],
  },
  // Comment mention notification
  {
    type: NotificationType.comment_mention,
    title: 'Bạn đã được nhắc đến trong một bình luận',
    content: '@Student One đã nhắc đến bạn trong một bình luận.',
    thumbnailUrl: 'https://example.com/mention.jpg',
    actionUrl: '/comments/2',
    userId: userIds[0],
    createdById: userIds[0],
  },
];

export const createStudyActivities = (userIds: string[]) =>
  [
    {
      userId: userIds[0],
      date: new Date(),
      reading: 1,
      listening: 1,
      writing: 1,
      speaking: 1,
      totalMinutes: 1,
    },
  ] as StudyActivity[];

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
