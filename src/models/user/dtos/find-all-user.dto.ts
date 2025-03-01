import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

import {
  PaginationInputDto,
  PaginationOutputDto,
} from 'src/common/dto/pagination.dto';
import { User } from 'src/models/user/entities/user.entity';

@InputType()
export class FindAllUsersDto extends PaginationInputDto {
  //docs
  @ApiPropertyOptional()
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;
}

@ObjectType()
export class UsersResponse {
  @Field(() => [User])
  //docs
  @ApiProperty()
  data: User[];

  @Field(() => PaginationOutputDto)
  //docs
  @ApiProperty()
  pagination: PaginationOutputDto;
}
