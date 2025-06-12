import { ApiProperty } from '@nestjs/swagger';
import { IBanner } from '../interface/banner-interface';

export class Banner implements IBanner {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  orderIndex: number;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  actionLink: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
