import { ApiProperty } from '@nestjs/swagger';

export class ConnectUserDto {
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
  username?: string;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  email?: string;
}
