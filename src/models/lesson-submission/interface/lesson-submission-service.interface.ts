import {
  CreateReadingSubmissionDTO,
  FindAllLessonSubmissionQuery,
  CreateListeningSubmissionDTO,
  CreateSpeakingSubmissionDTO,
  CreateWritingSubmissionDTO,
  UpdateWritingSubmissionDTO,
  FindAllReadingSubmissionsByUserQuery,
} from '../dto/lesson-submission-request.dto';

import {
  DeleteLessonSubmissionResponse,
  LessonSubmissionsResponse,
  ReadingSubmissionResponse,
  ListeningSubmissionResponse,
  SpeakingSubmissionResponse,
  WritingSubmissionResponse,
  WritingSubmissionResultResponse,
} from '../dto/lesson-submission-response.dto';

export interface ILessonSubmissionService {
  // Common
  findAllSubmissions(
    query: FindAllLessonSubmissionQuery,
  ): Promise<LessonSubmissionsResponse>;
  getAllSubmissionsByUser(
    userId: string,
    query: FindAllReadingSubmissionsByUserQuery,
  ): Promise<LessonSubmissionsResponse>;
  delete(id: string): Promise<DeleteLessonSubmissionResponse>;

  // Reading
  findOneReadingSubmission(id: string): Promise<ReadingSubmissionResponse>;
  createReadingSubmission(
    userId: string,
    dto: CreateReadingSubmissionDTO,
  ): Promise<ReadingSubmissionResponse>;

  // Listening
  findOneListeningSubmission(id: string): Promise<ListeningSubmissionResponse>;
  createListeningSubmission(
    userId: string,
    dto: CreateListeningSubmissionDTO,
  ): Promise<ListeningSubmissionResponse>;

  // Speaking
  findOneSpeakingSubmission(id: string): Promise<SpeakingSubmissionResponse>;
  createSpeakingSubmission(
    userId: string,
    dto: CreateSpeakingSubmissionDTO,
  ): Promise<SpeakingSubmissionResponse>;

  // Writing
  findOneWritingSubmission(
    id: string,
  ): Promise<WritingSubmissionResultResponse>;
  createWritingSubmission(
    userId: string,
    dto: CreateWritingSubmissionDTO,
  ): Promise<WritingSubmissionResponse>;
  updateWritingSubmission(
    id: string,
    userId: string,
    dto: UpdateWritingSubmissionDTO,
  ): Promise<WritingSubmissionResponse>;
}
