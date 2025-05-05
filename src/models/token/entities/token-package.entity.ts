import { ApiProperty } from '@nestjs/swagger';
import { ITokenPackage } from 'src/models/token/interface/token.interface';

export class TokenPackage implements ITokenPackage {
  @ApiProperty()
  id: string;

  @ApiProperty()
  pricePerToken: number;

  @ApiProperty()
  oldPricePerToken: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  popular: boolean;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  tokens: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
