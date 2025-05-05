import { ApiProperty } from '@nestjs/swagger';
import { ITokenWallet } from 'src/models/token/interface/token.interface';

export class TokenWallet implements ITokenWallet {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  deletedAt: Date | null;
}
