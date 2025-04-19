import { ApiProperty } from '@nestjs/swagger';
import { LessonSubmission } from '../entities/lesson-submission.entity';
import { ContentReadingSubmissionDTO } from './content/reading-submission.dto';
import { ContentListeningSubmissionDTO } from './content/listening-submission.dto';
import { ContentWritingSubmissionDTO } from './content/writing-submission.dto';
import { ContentSpeakingSubmissionDTO } from './content/speaking-submission.dto';
import { PaginationOutputDto } from 'src/common/dto/pagination.dto';
import { ReadingFeedbackDto } from 'src/models/lesson-submission/dto/feedback/reading.dto';
import { ListeningFeedbackDto } from 'src/models/lesson-submission/dto/feedback/listening.dto';
import { WritingFeedbackDTO } from 'src/models/lesson-submission/dto/feedback/writing.dto';
import { Prisma } from '@prisma/client';
import { SampleEssayDTO } from 'src/models/lesson/dto/content/writing.dto';

// Base Lesson Submission Response
export class BaseLessonSubmissionResponse {
  @ApiProperty()
  data: LessonSubmission;
}

// Common Responses
export class LessonSubmissionsResponse {
  @ApiProperty({ type: [LessonSubmission] })
  data: LessonSubmission[];

  @ApiProperty()
  pagination: PaginationOutputDto;
}

export class DeleteLessonSubmissionResponse {
  @ApiProperty()
  message: string;
}

// Reading Submission Response
export class ReadingSubmission extends LessonSubmission {
  @ApiProperty({
    type: () => ContentReadingSubmissionDTO,
  })
  content: ContentReadingSubmissionDTO & Prisma.JsonValue;

  @ApiProperty({
    type: () => ReadingFeedbackDto,
  })
  feedback: ReadingFeedbackDto & Prisma.JsonValue;
}

export class ReadingSubmissionResponse extends BaseLessonSubmissionResponse {
  @ApiProperty({ type: ReadingSubmission })
  data: ReadingSubmission;
}

// Listening Submission Response
export class ListeningSubmission extends LessonSubmission {
  @ApiProperty({
    type: () => ContentListeningSubmissionDTO,
  })
  content: ContentListeningSubmissionDTO & Prisma.JsonValue;

  @ApiProperty({
    type: () => ListeningFeedbackDto,
  })
  feedback: ListeningFeedbackDto & Prisma.JsonValue;
}

export class ListeningSubmissionResponse extends BaseLessonSubmissionResponse {
  @ApiProperty({ type: ListeningSubmission })
  data: ListeningSubmission;
}

// Writing Submission Response
export class WritingSubmission extends LessonSubmission {
  @ApiProperty({
    type: () => ContentWritingSubmissionDTO,
  })
  content: ContentWritingSubmissionDTO & Prisma.JsonValue;

  @ApiProperty({
    type: () => WritingFeedbackDTO,
  })
  feedback: WritingFeedbackDTO & Prisma.JsonValue;
}

export class WritingSubmissionResponse extends BaseLessonSubmissionResponse {
  @ApiProperty({ type: WritingSubmission })
  data: WritingSubmission;
}

export class WritingSubmissionResultResponse extends BaseLessonSubmissionResponse {
  @ApiProperty({ type: WritingSubmission })
  data: WritingSubmission;

  @ApiProperty({
    type: () => SampleEssayDTO,
  })
  exampleEssay: SampleEssayDTO & Prisma.JsonValue;
}

// Speaking Submission Response
export class SpeakingSubmission extends LessonSubmission {
  @ApiProperty({
    type: () => ContentSpeakingSubmissionDTO,
  })
  content: ContentSpeakingSubmissionDTO & Prisma.JsonValue;
}
export class SpeakingSubmissionResponse extends BaseLessonSubmissionResponse {
  @ApiProperty({ type: SpeakingSubmission })
  data: SpeakingSubmission;
}
