import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/models/user/entities/user.entity';
import { VocabularyPractice } from 'src/models/vocabulary-practice/entities/vocabulary-practice.entity';
import { IVocabulary } from 'src/models/vocabulary/interface/vocabulary.interface';

export class Vocabulary implements IVocabulary {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  term: string;
  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  meaning: string[];
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  exampleSentence: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  imageUrl: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  referenceLink: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  referenceName: string | null;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  repetitionLevel: number;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  nextReview: Date | null;
  @ApiProperty({
    type: 'string',
  })
  createdById: string;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
  @ApiProperty({
    type: () => User,
    required: false,
  })
  createdBy?: User;
  @ApiProperty({
    type: () => VocabularyPractice,
    isArray: true,
    required: false,
  })
  practices?: VocabularyPractice[];
}
