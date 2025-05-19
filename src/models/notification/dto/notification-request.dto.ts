import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { PaginationInputDto } from 'src/common/dto/pagination.dto';

export class CreateNotificationDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty({ enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  actionUrl?: string;

  @ApiProperty({ default: false })
  @IsOptional()
  isGlobal?: boolean;
}

export class FindAllNotificationQuery extends PaginationInputDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isGlobal?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;
}
