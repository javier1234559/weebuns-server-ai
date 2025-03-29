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
} from 'src/models/lesson/dto/lesson-request.dto';
import {
  LessonsResponse,
  DeleteLessonResponse,
  ReadingResponse,
  ListeningResponse,
  SpeakingResponse,
  WritingResponse,
} from 'src/models/lesson/dto/lesson-response.dto';

export interface ILessonService {
  // Common methods
  findAll(query: FindAllLessonQuery): Promise<LessonsResponse>;
  delete(id: string): Promise<DeleteLessonResponse>;

  // Reading methods
  findOneReading(id: string): Promise<ReadingResponse>;
  createReading(dto: CreateReadingDTO): Promise<ReadingResponse>;
  updateReading(id: string, dto: UpdateReadingDTO): Promise<ReadingResponse>;

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
