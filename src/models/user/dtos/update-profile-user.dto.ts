import { InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class UpdateProfileUserDto {
  @MinLength(3)
  //docs
  @ApiProperty()
  username: string;

  //docs
  @ApiProperty()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  //docs
  @ApiProperty()
  firstName?: string;

  @IsString()
  @IsOptional()
  //docs
  @ApiProperty()
  lastName?: string;

  @IsString()
  //docs
  @ApiProperty()
  @IsOptional()
  nativeLanguage: string;

  @ApiProperty()
  @IsOptional()
  profilePicture: string;
}
