import { ApiProperty } from '@nestjs/swagger';
import { IStudyActivity } from '../interface/study-activty.interface';

export class StudyActivity implements IStudyActivity {
  @ApiProperty({
    description: 'The ID of the study activity',
  })
  id: string;

  @ApiProperty({
    description: 'The ID of the user',
  })
  userId: string;

  @ApiProperty({
    description: 'The date of the study activity',
  })
  date: Date;

  @ApiProperty({
    description: 'The reading of the study activity',
  })
  reading: number;

  @ApiProperty({
    description: 'The listening of the study activity',
  })
  listening: number;

  @ApiProperty({
    description: 'The writing of the study activity',
  })
  writing: number;

  @ApiProperty({
    description: 'The speaking of the study activity',
  })
  speaking: number;

  @ApiProperty({
    description: 'The total minutes of the study activity',
  })
  totalMinutes: number;

  @ApiProperty({
    description: 'The created at of the study activity',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The updated at of the study activity',
  })
  updatedAt: Date;
}
