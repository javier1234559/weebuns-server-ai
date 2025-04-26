import { ApiProperty } from '@nestjs/swagger';
import { PaginationOutputDto } from 'src/common/dto/pagination.dto';
import { Vocabulary } from '../entities/vocabulary.entity';

export class VocabularyResponseDto {
  @ApiProperty({ type: Vocabulary })
  data: Vocabulary;
}

export class VocabulariesResponse {
  @ApiProperty({ type: [Vocabulary] })
  data: Vocabulary[];

  @ApiProperty({ type: PaginationOutputDto })
  pagination: PaginationOutputDto;
}

// Delete Response
export class DeleteVocabularyResponse {
  @ApiProperty()
  message: string;
}
