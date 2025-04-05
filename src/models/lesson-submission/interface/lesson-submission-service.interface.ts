import { 
    CreateReadingSubmissionDTO, 
    FindAllLessonSubmissionQuery, 
    UpdateReadingSubmissionDTO, 
    CreateListeningSubmissionDTO, 
    UpdateListeningSubmissionDTO, 
    CreateSpeakingSubmissionDTO, 
    UpdateSpeakingSubmissionDTO, 
    CreateWritingSubmissionDTO, 
    UpdateWritingSubmissionDTO 
} from "../dto/lesson-submission-request.dto";

import { 
    DeleteLessonSubmissionResponse, 
    LessonSubmissionsResponse, 
    ReadingSubmissionResponse, 
    ListeningSubmissionResponse, 
    SpeakingSubmissionResponse, 
    WritingSubmissionResponse 
} from "../dto/lesson-submission-response.dto";

export interface ILessonSubmissionService {
    findAllSubmissions(query: FindAllLessonSubmissionQuery): Promise<LessonSubmissionsResponse>;
    delete(id: string): Promise<DeleteLessonSubmissionResponse>;

    findOneReadingSubmission(id: string): Promise<ReadingSubmissionResponse>;
    createReadingSubmission(dto: CreateReadingSubmissionDTO): Promise<ReadingSubmissionResponse>;
    updateReadingSubmission(id: string, dto: UpdateReadingSubmissionDTO): Promise<ReadingSubmissionResponse>;

    findOneListeningSubmission(id: string): Promise<ListeningSubmissionResponse>;
    createListeningSubmission(dto: CreateListeningSubmissionDTO): Promise<ListeningSubmissionResponse>;
    updateListeningSubmission(id: string, dto: UpdateListeningSubmissionDTO): Promise<ListeningSubmissionResponse>;

    findOneSpeakingSubmission(id: string): Promise<SpeakingSubmissionResponse>;
    createSpeakingSubmission(dto: CreateSpeakingSubmissionDTO): Promise<SpeakingSubmissionResponse>;
    updateSpeakingSubmission(id: string, dto: UpdateSpeakingSubmissionDTO): Promise<SpeakingSubmissionResponse>;

    findOneWritingSubmission(id: string): Promise<WritingSubmissionResponse>;
    createWritingSubmission(dto: CreateWritingSubmissionDTO): Promise<WritingSubmissionResponse>;
    updateWritingSubmission(id: string, dto: UpdateWritingSubmissionDTO): Promise<WritingSubmissionResponse>;
}