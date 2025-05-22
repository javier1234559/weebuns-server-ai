import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class StudyActivityDtoQuery {
  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  month: number;

  @ApiProperty({ example: 2024 })
  @IsInt()
  @Min(2000)
  @IsNotEmpty()
  year: number;
}

export class CreateStudyActivityDto {
  @ApiProperty({ example: '2024-12-20' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  reading?: number = 0;

  @ApiProperty({ example: 20 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  listening?: number = 0;

  @ApiProperty({ example: 15 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  writing?: number = 0;

  @ApiProperty({ example: 25 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  speaking?: number = 0;

  @ApiProperty({ example: 90 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  totalMinutes: number;
}
