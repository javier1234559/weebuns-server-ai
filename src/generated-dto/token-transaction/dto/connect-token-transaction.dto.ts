import { ApiProperty } from '@nestjs/swagger';

export class ConnectTokenTransactionDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
}
