import { ApiProperty } from '@nestjs/swagger';

export class ConnectLessonSubmissionDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
}
