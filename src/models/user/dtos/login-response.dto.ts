import { ApiProperty } from '@nestjs/swagger';

import { User } from 'src/models/user/entities/user.entity';

export class UserResponse {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: User;
}
