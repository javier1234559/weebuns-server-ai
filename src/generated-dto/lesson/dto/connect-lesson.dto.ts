import { ApiProperty } from '@nestjs/swagger';

export class ConnectLessonDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
}
