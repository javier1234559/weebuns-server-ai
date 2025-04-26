import { IAuthPayload } from 'src/common/interface/auth-payload.interface';
import {
  CreateVocabularyDto,
  UpdateVocabularyDto,
  FindAllVocabularyQuery,
  UpdateVocabularyReviewDto,
} from '../dto/vocabulary-request.dto';
import {
  VocabularyResponseDto,
  VocabulariesResponse,
  DeleteVocabularyResponse,
} from '../dto/vocabulary-response.dto';

export interface IVocabularyService {
  create(
    createVocabularyDto: CreateVocabularyDto,
    user: IAuthPayload,
  ): Promise<VocabularyResponseDto>;

  findAll(
    query: FindAllVocabularyQuery,
    user: IAuthPayload,
  ): Promise<VocabulariesResponse>;

  findOne(id: string, user: IAuthPayload): Promise<VocabularyResponseDto>;

  update(
    id: string,
    updateVocabularyDto: UpdateVocabularyDto,
    user: IAuthPayload,
  ): Promise<VocabularyResponseDto>;

  remove(id: string, user: IAuthPayload): Promise<DeleteVocabularyResponse>;

  getDueVocabularies(user: IAuthPayload): Promise<VocabulariesResponse>;

  updateReviewStatus(
    id: string,
    dto: UpdateVocabularyReviewDto,
    user: IAuthPayload,
  ): Promise<VocabularyResponseDto>;
}
