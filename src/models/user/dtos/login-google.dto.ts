import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

export class LoginGoogleDto {
  @IsString()
  //docs
  @ApiProperty()
  accessToken: string;
}
