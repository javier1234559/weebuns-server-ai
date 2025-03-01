import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

export class RegisterGoogleDto {
  @IsString()
  //docs
  @ApiProperty()
  uuid: string;
}
