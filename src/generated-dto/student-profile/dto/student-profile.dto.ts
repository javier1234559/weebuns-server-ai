import { ApiProperty } from '@nestjs/swagger';

export class StudentProfileDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    nullable: true,
  })
  targetStudyDuration: number | null;
  @ApiProperty({
    type: 'number',
    format: 'float',
    nullable: true,
  })
  targetReading: number | null;
  @ApiProperty({
    type: 'number',
    format: 'float',
    nullable: true,
  })
  targetListening: number | null;
  @ApiProperty({
    type: 'number',
    format: 'float',
    nullable: true,
  })
  targetWriting: number | null;
  @ApiProperty({
    type: 'number',
    format: 'float',
    nullable: true,
  })
  targetSpeaking: number | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  nextExamDate: Date | null;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  tokensBalance: number;
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
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  deletedAt: Date | null;
}
