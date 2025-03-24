import { ApiProperty } from '@nestjs/swagger';
import { ContentReadingDTO } from './content/reading.dto';
import { Lesson } from 'src/models/lesson/entities/lesson.entity';
import { ContentListeningDTO } from 'src/models/lesson/dto/content/listening.dto';
import { ContentSpeakingDTO } from 'src/models/lesson/dto/content/speaking.dto';
import { ContentWritingDTO } from 'src/models/lesson/dto/content/writing.dto';
import { PaginationOutputDto } from 'src/common/dto/pagination.dto';

export class ResponseLessonDto extends Lesson {}

// Base Lesson Response
export class BaseLessonResponse {
  @ApiProperty()
  data: Lesson;
}

// Common Responses
export class LessonsResponse {
  @ApiProperty()
  data: Lesson[];

  @ApiProperty()
  pagination: PaginationOutputDto;
}

export class DeleteLessonResponse {
  @ApiProperty()
  message: string;
}

// Reading Response
export class ReadingResponse extends BaseLessonResponse {
  @ApiProperty()
  data: Lesson & {
    content: ContentReadingDTO;
  };
}

// Listening Response
export class ListeningResponse extends BaseLessonResponse {
  @ApiProperty()
  data: Lesson & {
    content: ContentListeningDTO;
  };
}

// Writing Response
export class WritingResponse extends BaseLessonResponse {
  @ApiProperty()
  data: Lesson & {
    content: ContentWritingDTO;
  };
}

// Speaking Response
export class SpeakingResponse extends BaseLessonResponse {
  @ApiProperty()
  data: Lesson & {
    content: ContentSpeakingDTO;
  };
}
