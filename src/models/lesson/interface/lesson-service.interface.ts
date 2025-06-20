import {
  FindAllLessonQuery,
  CreateReadingDTO,
  UpdateReadingDTO,
  CreateListeningDTO,
  CreateSpeakingDTO,
  CreateWritingDTO,
  UpdateListeningDTO,
  UpdateSpeakingDTO,
  UpdateWritingDTO,
  UpdateLessonDTO,
} from 'src/models/lesson/dto/lesson-request.dto';
import {
  LessonsResponse,
  DeleteLessonResponse,
  ReadingResponse,
  ListeningResponse,
  SpeakingResponse,
  WritingResponse,
  BaseLessonResponse,
} from 'src/models/lesson/dto/lesson-response.dto';

export interface ILessonService {
  // Common methods
  findAll(query: FindAllLessonQuery): Promise<LessonsResponse>;
  delete(id: string): Promise<DeleteLessonResponse>;
  updateLesson(id: string, dto: UpdateLessonDTO): Promise<BaseLessonResponse>;

  // Reading methods
  findOneReading(id: string): Promise<ReadingResponse>;
  createReading(dto: CreateReadingDTO): Promise<ReadingResponse>;
  updateReading(id: string, dto: UpdateReadingDTO): Promise<ReadingResponse>;
  // submitReading(
  //   lessonId: string,
  //   userId: string,
  //   dto: SubmitReadingLessonDto,
  // ): Promise<ReadingSubmissionResponse>;

  // getReadingResult(
  //   lessonId: string,
  //   submissionId: string,
  // ): Promise<ReadingResultResponse>;

  // Listening methods
  findOneListening(id: string): Promise<ListeningResponse>;
  createListening(dto: CreateListeningDTO): Promise<ListeningResponse>;
  updateListening(
    id: string,
    dto: UpdateListeningDTO,
  ): Promise<ListeningResponse>;

  // Speaking methods
  findOneSpeaking(id: string): Promise<SpeakingResponse>;
  createSpeaking(dto: CreateSpeakingDTO): Promise<SpeakingResponse>;
  updateSpeaking(id: string, dto: UpdateSpeakingDTO): Promise<SpeakingResponse>;

  // Writing methods
  findOneWriting(id: string): Promise<WritingResponse>;
  createWriting(dto: CreateWritingDTO): Promise<WritingResponse>;
  updateWriting(id: string, dto: UpdateWritingDTO): Promise<WritingResponse>;
}
