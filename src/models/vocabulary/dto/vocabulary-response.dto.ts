import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationOutputDto } from 'src/common/dto/pagination.dto';
import { Vocabulary } from 'src/models/vocabulary/entities/vocabulary.entity';

@ObjectType()
export class VocabularyResponseDto {
  @Field(() => [Vocabulary])
  @ApiProperty({ type: Vocabulary })
  data: Vocabulary[];

  @Field(() => PaginationOutputDto)
  @ApiProperty()
  pagination: PaginationOutputDto;
}
