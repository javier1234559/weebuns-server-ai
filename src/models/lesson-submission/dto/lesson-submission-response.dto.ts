import { ApiProperty } from '@nestjs/swagger';
import { LessonSubmission } from '../entities/lesson-submission.entity';
import { ContentReadingSubmissionDTO } from './content/reading-submission.dto';
import { ContentListeningSubmissionDTO } from './content/listening-submission.dto';
import { ContentWritingSubmissionDTO } from './content/writing-submission.dto';
import { ContentSpeakingSubmissionDTO } from './content/speaking-submission.dto';
import { PaginationOutputDto } from 'src/common/dto/pagination.dto';

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
export class ReadingSubmissionResponse extends BaseLessonSubmissionResponse {
  @ApiProperty()
  data: LessonSubmission & {
    content: ContentReadingSubmissionDTO;
  };
}

// Listening Submission Response
export class ListeningSubmissionResponse extends BaseLessonSubmissionResponse {
  @ApiProperty()
  data: LessonSubmission & {
    content: ContentListeningSubmissionDTO;
  };
}

// Writing Submission Response
export class WritingSubmissionResponse extends BaseLessonSubmissionResponse {
  @ApiProperty()
  data: LessonSubmission & {
    content: ContentWritingSubmissionDTO;
  };
}

// Speaking Submission Response
export class SpeakingSubmissionResponse extends BaseLessonSubmissionResponse {
  @ApiProperty()
  data: LessonSubmission & {
    content: ContentSpeakingSubmissionDTO;
  };
}
