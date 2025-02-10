import { ApiProperty } from '@nestjs/swagger';

import { User } from 'src/user/entities/user.entity';

export class UserLoginResponse {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: User;
}

export class UserRegisterResponse {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: User;
}

export class UserRefreshTokenResponse {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}

export class UserResponse {
  @ApiProperty()
  user: User;
}

export class LogoutResponse {
  @ApiProperty()
  message: string;
}
