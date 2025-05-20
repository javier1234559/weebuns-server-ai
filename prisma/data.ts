import {
  UserRole,
  ContentStatus,
  AuthProvider,
  SkillType,
  LessonType,
  Prisma,
  NotificationType,
  StudyActivity,
  PaymentType,
  PaymentStatus,
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
  tokenPackages: string[];
  tokenWallets: string[];
  transactions: string[];
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
  tokenPackages: [],
  tokenWallets: [],
  transactions: [],
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
    bio: 'Student bio',
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
    bio: 'Teacher bio',
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
    bio: 'Admin bio',
    profilePicture: 'https://example.com/admin1.jpg',
    isEmailVerified: true,
    lastLogin: new Date(),
  },
];

export const createTeacherProfiles = (userIds: string[]) => [
  {
    userId: userIds[1],
    longBio:
      'Experienced English teacher with a passion for helping students achieve their language learning goals.',
    introVideoUrlEmbed: 'https://www.youtube.com/embed/2JzAHYg0zLY',
    certifications: 'TESOL Certified',
    teachingExperience:
      '5 years of teaching experience in both online and classroom settings',
    other: 'Specialized in business English and test preparation',
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
  },
];

export const createLessons = (userIds: string[]) => [
  {
    skill: SkillType.writing,
    title: 'IELTS Writing Task 2: Does workaholism have positive effects?',
    description: 'Practice writing an opinion essay for IELTS Writing Task 2',
    lessonType: LessonType.practice,
    level: 'intermediate',
    topic: 'ielts',
    thumbnailUrl:
      'https://img.freepik.com/vector-mien-phi/procrastination-concept-illustration_114360-17291.jpg',
    timeLimit: 40,
    content: {
      task: 'Nowadays, more people move away from their friends and families for work. Do advantages outweigh the disadvantages?',
      ai_prompt:
        'You are an expert IELTS writing teacher. You help students to improve their IELTS improve Idea and response Example like Introduction,Body1,Body2,Conclusion.',
      resources: {
        sample_essay: {
          body1:
            '<p><strong>Admittedly, there may be some consequences when people leave their homes for a new place in search of better job opportunities. </strong><span style="color: rgb(45, 194, 107);">One of them is that migrating across the country may emotionally impact migrants and their loved ones. Since life is often centered around established social circles, including families and friends, moving to a new location can result in homesickness and a sense of missing out on important events, potentially causing family members to drift apart over time. This is especially true in Asia, where people often value quality time with their family over socializing with friends. </span><span style="color: rgb(53, 152, 219);">On a societal level, moving away for work could potentially cause instability in the labor market in less developed regions. This is because it could be difficult for rural enterprises to find suitable candidates for their job vacancies, eventually compromising their productivity as well as the competitiveness of the local economy.</span></p>',
          body2:
            '\n        <p><strong>However, despite these disadvantages, the benefits of relocating for work are more significant.</strong><span style="color: rgb(45, 194, 107);"> In terms of career prospects, settling down in a new environment could help migrants to have the opportunity to pursue their dreams, which would only be possible by moving away from narrow minded people in the countryside. For example, in Asia, parents and the elderly often emphasize career stability over pursuing one’s passions, which leads to false expectations for their children’s futures, thus suppressing young people’s talents. </span><span style="color: rgb(53, 152, 219);">Another benefit could be the opportunity to live in a foreign country, which, in addition to possible higher salaries, enables migrants to pursue jobs that may not be available in their home countries. A case in point is that IT workers stand to benefit greatly from working for major tech corporations in the US.</span></p>',
          conclusion:
            '<p dir="ltr">In conclusion, while I acknowledge that relocating for work may pose certain problems relating to migrants\' feelings and the rural economy, I am convinced that the advantages in personal and professional growth are far more impactful.</p>',
          instruction:
            '\n        <div class="p-3 body-2 z-10 mb-[4px] flex-1 border border-[#13A62E] rounded-[8px] bg-[#E5F6E9]" style="min-height: calc(54px);"><div><p>It has become more common for people to relocate to a new city or country for work. <strong>Although this trend may present certain challenges, I believe the resultant benefits far outweigh them.</strong></p></div></div>',
        },
        analysis_guide:
          "<h2>HƯỚNG DẪN VIẾT BÀI</h2><p>&nbsp;</p><h3><em>Xem livestream giải đề này cùng thầy Phạm Minh Khoa (</em><strong><em>2 lần 9.0</em></strong><em>) <u>tại đây bạn nhé!</u></em></h3><p>&nbsp;</p><h2><strong><u>1. Giải thích đề</u></strong></h2><ul><li><p>Đề bài nói về xu hướng ngày càng nhiều người rời xa bạn bè và gia đình để đi làm việc ở nơi khác. Đề bài yêu cầu bạn cân nhắc xem liệu lợi ích của xu hướng này có lớn hơn những bất lợi hay không.</p></li></ul><ul><li><p>Đây là một chủ đề phổ biến trong thời đại toàn cầu hóa, khi người lao động có xu hướng di chuyển (<strong>relocate</strong>) đến các thành phố lớn hoặc nước ngoài để tìm kiếm cơ hội việc làm tốt hơn. Xu hướng này đặc biệt phổ biến ở các nước đang phát triển, nơi mà sự chênh lệch về cơ hội giữa các vùng miền còn lớn.</p></li></ul><p>&nbsp;</p><h2><strong><u>2. Gợi ý lập luận &amp; phân body</u></strong></h2><ul><li><p>Bạn có thể cho rằng lợi ích lớn hơn hoặc nhỏ hơn so với bất lợi.</p></li><li><p><strong>Trong bài này, chúng mình sẽ lập luận theo cách 40/60 (balanced approach)</strong></p></li><li><p>Chúng mình cho rằng lợi ích lớn hơn nhiều so với bất lợi (<strong>benefits far outweigh them</strong>). Chúng ta sẽ theo hướng này.</p><ul><li><p>Body 1 sẽ bàn về những bất lợi của việc di chuyển đi làm xa.</p></li><li><p>Body 2 sẽ thảo luận về những lợi ích đáng kể hơn của việc này.</p></li></ul></li></ul><p>&nbsp;</p><h2><strong><u>3. Gợi ý viết body 1</u></strong></h2><p>Mình sẽ bàn về những bất lợi của việc di chuyển đi làm xa.</p><p>Cấu trúc: Topic Sentence ➜ Supporting Idea 1 ➜ Supporting idea 2</p><h3>&nbsp;✦ <u>Topic sentence:</u></h3><p>Việc di chuyển đi xa (<strong>relocating</strong>) để tìm việc có thể gây ra một số hậu quả (<strong>consequences</strong>) cho người di cư và xã hội.</p><h3>&nbsp;✦ <u>Supporting idea 1:</u></h3><p>Di cư (<strong>migrating</strong>) có thể gây tác động về mặt cảm xúc (<strong>emotionally impact</strong>) đối với người di cư và người thân</p><p>&nbsp; ➜ cuộc sống thường xoay quanh các mối quan hệ xã hội đã thiết lập (<strong>established social circles</strong>)&nbsp;</p><p>&nbsp; ➜ chuyển đến nơi mới có thể gây nhớ nhà (<strong>homesickness</strong>) và cảm giác bỏ lỡ các sự kiện quan trọng (<strong>missing out on important events</strong>)</p><p>&nbsp; ➜ có thể làm cho các thành viên gia đình xa cách nhau theo thời gian (<strong>drift apart over time</strong>)</p><p>&nbsp; ➜ đặc biệt đúng ở châu Á, nơi mọi người thường coi trọng thời gian chất lượng với gia đình hơn là giao tiếp xã hội với bạn bè</p><h3>&nbsp;✦ <u>Supporting idea 2:</u></h3><p>Ở cấp độ xã hội (<strong>societal level</strong>), di chuyển đi làm xa có thể gây bất ổn cho thị trường lao động (<strong>instability in the labor market</strong>) ở các vùng kém phát triển hơn</p><p>&nbsp; ➜ doanh nghiệp nông thôn (<strong>rural enterprises</strong>) khó tìm được ứng viên phù hợp cho vị trí tuyển dụng</p><p>&nbsp; ➜ ảnh hưởng đến năng suất (<strong>compromising their productivity</strong>) và khả năng cạnh tranh của nền kinh tế địa phương (<strong>competitiveness of the local economy</strong>)</p><p>&nbsp;</p><h2><strong><u>4. Gợi ý viết body 2</u></strong></h2><p>Mình sẽ bàn về những lợi ích đáng kể của việc di chuyển đi làm xa.</p><p>Cấu trúc: Topic Sentence ➜ Supporting Idea 1 ➜ Supporting idea 2</p><h3>&nbsp;✦ <u>Topic sentence:</u></h3><p>Việc di chuyển đi xa để làm việc mang lại những lợi ích đáng kể hơn (<strong>more significant</strong>) bất lợi của nó.</p><h3>&nbsp;✦ <u>Supporting idea 1:</u></h3><p>Về triển vọng nghề nghiệp (<strong>career prospects</strong>), định cư ở một môi trường mới (<strong>settling down in a new environment</strong>) giúp người di cư có cơ hội theo đuổi ước mơ (<strong>pursue their dreams</strong>)</p><p>&nbsp; ➜ tránh xa những người có tư tưởng hẹp hòi ở nông thôn (<strong>narrow minded people in the countryside</strong>)</p><p>&nbsp; ➜ ví dụ ở châu Á, cha mẹ và người lớn tuổi thường đề cao sự ổn định nghề nghiệp hơn là theo đuổi đam mê (<strong>pursuing one's passions</strong>)</p><p>&nbsp; ➜ tạo ra kỳ vọng sai lầm về tương lai của con cái (<strong>false expectations for their children's futures</strong>)&nbsp;</p><p>&nbsp; ➜ kìm hãm tài năng của giới trẻ (<strong>suppressing young people's talents</strong>)</p><h3>&nbsp;✦ <u>Supporting idea 2:</u></h3><p>Cơ hội sống ở nước ngoài (<strong>live in a foreign country</strong>)</p><p>&nbsp; ➜ ngoài mức lương có thể cao hơn (<strong>higher salaries</strong>), còn cho phép người di cư theo đuổi những công việc không có sẵn ở quê nhà</p><p>&nbsp; ➜ ví dụ như công nhân IT được hưởng lợi rất nhiều khi làm việc cho các tập đoàn công nghệ lớn ở Mỹ (<strong>major tech corporations in the US</strong>)</p>",
      },
      vocabulary_list: [
        {
          tags: [],
          term: 'Narrow-minded',
          meaning: [
            'Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life.',
          ],
          next_review: '2025-05-17T02:11:12.345Z',
          example_sentence:
            'The narrow-minded people in the countryside are not open to new ideas.',
          repetition_level: 0,
        },
      ],
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
      'https://img.freepik.com/hinh-chup-mien-phi/privacy-policy-information-principle-strategy-rules-concept_53876-147698.jpg',
    topic: 'ielts',
    timeLimit: 40,
    content: {
      text: 'To: All Staff\nFrom: Human Resources Department\nSubject: Updated Office Attendance Policy\n\nDear Employees,\n\nWe would like to inform you of an important update to our attendance policy. Starting next Monday, all employees are required to clock in using the new digital attendance system installed at the main entrance.\n\nThis system will automatically record your arrival and departure times. Please ensure that you arrive no later than 9:00 A.M. and do not leave before 5:00 P.M. without prior approval from your supervisor.\n\nAny employee who fails to follow this procedure three times within a month may be subject to a warning.\n\nIf you have any questions, please contact the HR department.',
      questions: [
        {
          id: '1',
          question: 'What is the main purpose of this email?',
          answer_list: [
            {
              answer: 'To announce a new employee benefit',
            },
            {
              answer: 'To introduce a new attendance system',
            },
            {
              answer: 'To promote an employee training session',
            },
            {
              answer: 'To notify about a holiday schedule',
            },
          ],
          is_bookmark: false,
          right_answer: 'To introduce a new attendance system',
        },
        {
          id: '2',
          question: 'When will the new system be implemented?',
          answer_list: [
            {
              answer: 'Tomorrow',
            },
            {
              answer: 'Next Monday',
            },
            {
              answer: 'This Friday',
            },
            {
              answer: 'Next month',
            },
          ],
          is_bookmark: false,
          right_answer: 'Next Monday',
        },
        {
          id: '3',
          question:
            'What will happen if an employee fails to follow the policy three times in a month?',
          answer_list: [
            {
              answer: 'They will be fined',
            },
            {
              answer: 'They will lose a bonus',
            },
            {
              answer: 'They may receive a warning',
            },
            {
              answer: 'They must attend a training',
            },
          ],
          is_bookmark: false,
          right_answer: 'They may receive a warning',
        },
        {
          id: '4',
          question: 'Where is the attendance system located?',
          answer_list: [
            {
              answer: 'In each department',
            },
            {
              answer: 'At the front desk',
            },
            {
              answer: 'Online via mobile app',
            },
            {
              answer: 'At the main entrance',
            },
          ],
          is_bookmark: false,
          right_answer: 'At the main entrance',
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
        'https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEIi23FhqP0S9vF1zWsX4manbGgQOe8ilp7DAd',
      questions: [
        {
          id: '1',
          question: 'What did the speaker order?',
          answer_list: [
            {
              answer: 'A chicken sandwich',
            },
            {
              answer: 'A grilled chicken salad',
            },
            {
              answer: 'A bowl of soup',
            },
            {
              answer: 'A beef burger',
            },
          ],
          is_bookmark: false,
          right_answer: 'A grilled chicken salad',
        },
        {
          id: '2',
          question: 'Why did the speaker ask for the dressing on the side?',
          answer_list: [
            {
              answer: 'They are allergic to it',
            },
            {
              answer: "They don't like the taste",
            },
            {
              answer: 'They are trying to eat healthier',
            },
            {
              answer: 'The waiter suggested it',
            },
          ],
          is_bookmark: false,
          right_answer: 'They are trying to eat healthier',
        },
        {
          id: '3',
          question: 'How much did the speaker pay for the meal?',
          answer_list: [
            {
              answer: '$9.75',
            },
            {
              answer: '$10.50',
            },
            {
              answer: '$11.20',
            },
            {
              answer: '$12.00',
            },
          ],
          is_bookmark: false,
          right_answer: '$10.50',
        },
      ],
    },
    status: ContentStatus.published,
    createdById: userIds[1],
  },
  {
    skill: SkillType.speaking,
    title: 'IELTS Speaking : Talk about your travel experience',
    description:
      'Practice speaking about your travel experience for IELTS Speaking',
    lessonType: LessonType.practice,
    level: 'intermediate',
    topic: 'ielts',
    thumbnailUrl:
      'https://img.freepik.com/hinh-chup-mien-phi/travel-concept-with-baggage_23-2149153260.jpg?ga=GA1.1.1179737765.1747448580&semt=ais_hybrid&w=740',
    timeLimit: 40,
    content: {
      promptText: "Let's practice speaking English",
      topicText: 'Travel and Tourism',
      followupExamples: [
        'What places have you visited?',
        'How was your last trip?',
        'Do you prefer traveling alone or with friends?',
        'What country would you like to visit next and why?',
      ],
      backgroundKnowledge:
        "Focus on travel experiences, cultural differences, and common travel vocabulary such as 'hotel', 'sightseeing', 'itinerary', 'passport'.",
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
    identifierId: 'writingAll',
    content: 'Bài viết này rất hữu ích, cảm ơn tác giả!',
    userId: userIds[0],
  },
  {
    identifierId: 'writingAll',
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

export const tokenPackages: Prisma.TokenPackageCreateInput[] = [
  {
    code: 'small',
    name: 'Gói Nhỏ',
    tokens: 20,
    price: 25000,
    pricePerToken: 1250,
    oldPricePerToken: 1500,
    message: 'Phù hợp dùng thử',
    popular: false,
  },
  {
    code: 'standard',
    name: 'Gói Tiêu Chuẩn',
    tokens: 100,
    price: 100000,
    pricePerToken: 1000,
    oldPricePerToken: 1250,
    message: 'Phổ biến',
    popular: true,
  },
  {
    code: 'savings',
    name: 'Gói Tiết Kiệm',
    tokens: 300,
    price: 250000,
    pricePerToken: 833,
    oldPricePerToken: 1000,
    message: 'Tiết kiệm nhất',
    popular: false,
  },
];

export const createTokenWallet = (userIds: string[]) => ({
  userId: userIds[0], // test_user
  balance: 100,
});

export const createTransaction = (userIds: string[], packageId: string) => ({
  userId: userIds[0], // test_user
  packageId: packageId, // This should be a UUID
  amount: 100000,
  tokenAmount: 100,
  paymentType: PaymentType.bank,
  transactionId: 'test-transaction-1',
  status: PaymentStatus.completed,
  paymentDate: new Date(),
  type: 'token_purchase',
});
