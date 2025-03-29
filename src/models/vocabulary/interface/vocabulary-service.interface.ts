import { PaginationInputDto } from 'src/common/dto/pagination.dto';
import { IAuthPayload } from 'src/common/interface/auth-payload.interface';
import { CreateVocabularyDto } from 'src/models/vocabulary/dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from 'src/models/vocabulary/dto/update-vocabulary.dto';
import { VocabularyFilterDto } from 'src/models/vocabulary/dto/vocabulary-filter.dto';
import { Vocabulary } from 'src/models/vocabulary/entities/vocabulary.entity';

export interface IVocabularyService {
  create(
    createVocabularyDto: CreateVocabularyDto,
    user: IAuthPayload,
  ): Promise<Vocabulary>;

  findAll(
    paginationDto: PaginationInputDto,
    user: IAuthPayload,
    filters?: VocabularyFilterDto,
  ): Promise<{
    data: Vocabulary[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>;

  findOne(id: string, user: IAuthPayload): Promise<Vocabulary>;

  update(
    id: string,
    updateVocabularyDto: UpdateVocabularyDto,
    user: IAuthPayload,
  ): Promise<Vocabulary>;

  remove(id: string, user: IAuthPayload): Promise<Vocabulary>;

  getDueVocabularies(user: IAuthPayload): Promise<Vocabulary[]>;

  updateReviewStatus(
    id: string,
    repetitionLevel: number,
    user: IAuthPayload,
  ): Promise<Vocabulary>;
}
