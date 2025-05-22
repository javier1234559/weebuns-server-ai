import { ApiProperty } from '@nestjs/swagger';

export class ActivityData {
  @ApiProperty({
    description: 'The date of the study activity',
    example: '2025-02-17',
  })
  date: string;

  @ApiProperty({
    description: 'Number of reading activities',
    example: 2,
  })
  reading: number;

  @ApiProperty({
    description: 'Number of listening activities',
    example: 1,
  })
  listening: number;

  @ApiProperty({
    description: 'Number of writing activities',
    example: 0,
  })
  writing: number;

  @ApiProperty({
    description: 'Number of speaking activities',
    example: 0,
  })
  speaking: number;

  @ApiProperty({
    description: 'Total time spent in format "XhYm"',
    example: '3h39m',
  })
  total_time: string;
}

export class ActivityDataResponse {
  @ApiProperty({
    description: 'Record of activities by date',
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        date: { type: 'string', example: '2025-02-17' },
        reading: { type: 'number', example: 2 },
        listening: { type: 'number', example: 1 },
        writing: { type: 'number', example: 0 },
        speaking: { type: 'number', example: 0 },
        total_time: { type: 'string', example: '3h39m' },
      },
    },
    example: {
      '2025-02-17': {
        date: '2025-02-17',
        reading: 2,
        listening: 1,
        writing: 0,
        speaking: 0,
        total_time: '3h39m',
      },
    },
  })
  data: Record<string, ActivityData>;
}
