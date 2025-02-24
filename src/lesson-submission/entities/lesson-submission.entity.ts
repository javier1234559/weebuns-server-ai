import { Prisma, SkillType, SubmissionStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Lesson } from '../../lesson/entities/lesson.entity';

export class LessonSubmission {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  userId: string;
  @ApiProperty({
    type: 'string',
  })
  lessonId: string;
  @ApiProperty({
    enum: SkillType,
    enumName: 'SkillType',
  })
  submissionType: SkillType;
  @ApiProperty({
    enum: SubmissionStatus,
    enumName: 'SubmissionStatus',
  })
  status: SubmissionStatus;
  @ApiProperty({
    type: () => Object,
    nullable: true,
  })
  content: Prisma.JsonValue | null;
  @ApiProperty({
    type: () => Object,
    nullable: true,
  })
  feedback: Prisma.JsonValue | null;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  tokensUsed: number;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  submittedAt: Date | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  gradedAt: Date | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  gradedById: string | null;
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
    type: () => User,
    required: false,
  })
  user?: User;
  @ApiProperty({
    type: () => Lesson,
    required: false,
  })
  lesson?: Lesson;
  @ApiProperty({
    type: () => User,
    required: false,
    nullable: true,
  })
  gradedBy?: User | null;
}
