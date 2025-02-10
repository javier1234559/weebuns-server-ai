import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  //docs
  @ApiProperty()
  username: string;

  @IsEmail()
  //docs
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(6)
  //docs
  @ApiProperty()
  password: string;

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
  nativeLanguage: string;
}
