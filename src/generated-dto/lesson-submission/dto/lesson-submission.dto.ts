import { Prisma, SkillType, SubmissionStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class LessonSubmissionDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
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
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
}
