import { AuthProvider, UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { TeacherProfile } from '../../teacher-profile/entities/teacher-profile.entity';
import { StudentProfile } from '../../student-profile/entities/student-profile.entity';
import { Lesson } from '../../lesson/entities/lesson.entity';
import { LessonSubmission } from '../../lesson-submission/entities/lesson-submission.entity';
import { Vocabulary } from '../../vocabulary/entities/vocabulary.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { CommentReaction } from '../../comment-reaction/entities/comment-reaction.entity';
import { Notification } from '../../notification/entities/notification.entity';
import { TokenTransaction } from '../../token-transaction/entities/token-transaction.entity';
import { VocabularyPractice } from '../../vocabulary-practice/entities/vocabulary-practice.entity';

export class User {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  username: string;
  @ApiProperty({
    type: 'string',
  })
  email: string;
  @ApiProperty({
    type: 'string',
  })
  passwordHash: string;
  @ApiProperty({
    enum: UserRole,
    enumName: 'UserRole',
  })
  role: UserRole;
  @ApiProperty({
    enum: AuthProvider,
    enumName: 'AuthProvider',
  })
  authProvider: AuthProvider;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  authProviderId: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  firstName: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  lastName: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  profilePicture: string | null;
  @ApiProperty({
    type: 'boolean',
  })
  isEmailVerified: boolean;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  lastLogin: Date | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  deletedAt: Date | null;
  @ApiProperty({
    type: () => TeacherProfile,
    required: false,
    nullable: true,
  })
  teacherProfile?: TeacherProfile | null;
  @ApiProperty({
    type: () => StudentProfile,
    required: false,
    nullable: true,
  })
  studentProfile?: StudentProfile | null;
  @ApiProperty({
    type: () => Lesson,
    isArray: true,
    required: false,
  })
  lessons?: Lesson[];
  @ApiProperty({
    type: () => LessonSubmission,
    isArray: true,
    required: false,
  })
  submissions?: LessonSubmission[];
  @ApiProperty({
    type: () => LessonSubmission,
    isArray: true,
    required: false,
  })
  gradedSubmissions?: LessonSubmission[];
  @ApiProperty({
    type: () => Vocabulary,
    isArray: true,
    required: false,
  })
  vocabularies?: Vocabulary[];
  @ApiProperty({
    type: () => Comment,
    isArray: true,
    required: false,
  })
  comments?: Comment[];
  @ApiProperty({
    type: () => CommentReaction,
    isArray: true,
    required: false,
  })
  reactions?: CommentReaction[];
  @ApiProperty({
    type: () => Notification,
    isArray: true,
    required: false,
  })
  notifications?: Notification[];
  @ApiProperty({
    type: () => Notification,
    isArray: true,
    required: false,
  })
  createdNotifications?: Notification[];
  @ApiProperty({
    type: () => TokenTransaction,
    isArray: true,
    required: false,
  })
  tokenTransactions?: TokenTransaction[];
  @ApiProperty({
    type: () => VocabularyPractice,
    isArray: true,
    required: false,
  })
  VocabularyPractice?: VocabularyPractice[];
}
