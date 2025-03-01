import { ApiProperty } from '@nestjs/swagger';

export class ConnectTeacherProfileDto {
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  id?: string;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  userId?: string;
}
