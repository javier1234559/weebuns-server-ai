import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  //docs
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(6)
  //docs
  @ApiProperty()
  password: string;
}
