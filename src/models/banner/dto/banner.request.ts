import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationInputDto } from 'src/common/dto/pagination.dto';

export class CreateBannerDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  orderIndex: number;

  @ApiProperty()
  @IsString()
  imageUrl: string;

  @ApiProperty()
  @IsString()
  actionLink: string;
}

export class FindAllBannerQuery extends PaginationInputDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  orderIndex: number;
}

export class UpdateBannerDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  orderIndex: number;

  @ApiProperty()
  @IsString()
  imageUrl: string;

  @ApiProperty()
  @IsString()
  actionLink: string;
}
