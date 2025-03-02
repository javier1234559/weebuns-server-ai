import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

export class LoginFacebookDto {
  @IsString()
  //docs
  @ApiProperty()
  accessToken: string;
}
