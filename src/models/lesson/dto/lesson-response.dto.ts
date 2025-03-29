import { ApiProperty } from '@nestjs/swagger';
import { ContentReadingDTO } from './content/reading.dto';
import { Lesson } from 'src/models/lesson/entities/lesson.entity';
import { ContentListeningDTO } from 'src/models/lesson/dto/content/listening.dto';
import { ContentSpeakingDTO } from 'src/models/lesson/dto/content/speaking.dto';
import { ContentWritingDTO } from 'src/models/lesson/dto/content/writing.dto';
import { PaginationOutputDto } from 'src/common/dto/pagination.dto';
import { Prisma } from '@prisma/client';

export class ResponseLessonDto extends Lesson {}

// Base Lesson Response
export class BaseLessonResponse {
  @ApiProperty()
  data: Lesson;
}

// Common Responses
export class LessonsResponse {
  @ApiProperty({ type: [Lesson] })
  data: Lesson[];

  @ApiProperty()
  pagination: PaginationOutputDto;
}

export class DeleteLessonResponse {
  @ApiProperty()
  message: string;
}

// Reading Response
export class ReadingLesson extends Lesson {
  @ApiProperty({
    type: () => ContentReadingDTO,
  })
  content: ContentReadingDTO & Prisma.JsonValue;
}

export class ReadingResponse extends BaseLessonResponse {
  @ApiProperty({
    type: () => ReadingLesson,
  })
  data: ReadingLesson;
}

// Listening Response
export class ListeningLesson extends Lesson {
  @ApiProperty({
    type: () => ContentListeningDTO,
  })
  content: ContentListeningDTO & Prisma.JsonValue;
}

export class ListeningResponse extends BaseLessonResponse {
  @ApiProperty({
    type: () => ListeningLesson,
  })
  data: ListeningLesson;
}

// Writing Response
export class WritingLesson extends Lesson {
  @ApiProperty({
    type: () => ContentWritingDTO,
  })
  content: ContentWritingDTO & Prisma.JsonValue;
}

export class WritingResponse extends BaseLessonResponse {
  @ApiProperty({
    type: () => WritingLesson,
  })
  data: WritingLesson;
}

// Speaking Response
export class SpeakingLesson extends Lesson {
  @ApiProperty({
    type: () => ContentSpeakingDTO,
  })
  content: ContentSpeakingDTO & Prisma.JsonValue;
}

export class SpeakingResponse extends BaseLessonResponse {
  @ApiProperty({
    type: () => SpeakingLesson,
  })
  data: SpeakingLesson;
}
