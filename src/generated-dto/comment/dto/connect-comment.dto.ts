import { ApiProperty } from '@nestjs/swagger';

export class ConnectCommentDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
}
