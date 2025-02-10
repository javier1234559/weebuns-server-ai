import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

@InputType()
export class PaginationInputDto {
  @Field(() => Int)
  @Transform(({ value }) => parseInt(value) || 1)
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    default: 1,
    type: Number,
  })
  page: number = 1;

  @Field(() => Int)
  @Transform(({ value }) => parseInt(value) || 10)
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    default: 10,
    type: Number,
  })
  perPage: number = 10;
}

@ObjectType()
export class PaginationOutputDto {
  @Field(() => Int)
  @ApiProperty({ example: 100, description: 'Total number of items' })
  totalItems: number;

  @Field(() => Int)
  @ApiProperty({ example: 1, description: 'Current page number' })
  currentPage: number;

  @Field(() => Int)
  @ApiProperty({ example: 10, description: 'Total number of pages' })
  totalPages: number;

  @Field(() => Int)
  @ApiProperty({ example: 10, description: 'Number of items per page' })
  itemsPerPage: number;

  @Field(() => Boolean)
  @ApiProperty({
    example: true,
    description: 'Indicates if there is a next page',
  })
  hasNextPage: boolean;

  @Field(() => Boolean)
  @ApiProperty({
    example: false,
    description: 'Indicates if there is a previous page',
  })
  hasPreviousPage: boolean;
}
