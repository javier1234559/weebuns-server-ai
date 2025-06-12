import { PaginationOutputDto } from 'src/common/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Banner } from 'src/models/banner/entities/banner.entity';

export class SingleBannerResponse {
  @ApiProperty({ type: Banner })
  data: Banner;
}

export class BannerResponse {
  @ApiProperty({ type: [Banner] })
  data: Banner[];

  @ApiProperty()
  pagination: PaginationOutputDto;
}

export class DeleteBannerResponse {
  @ApiProperty()
  message: string;
}
