import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/models/user/entities/user.entity';

export class UserLoginResponse {
  @ApiProperty()
  access_token: string;
  @ApiProperty()
  user: Omit<User, 'passwordHash'> | null;
}

export class UserRegisterResponse {
  @ApiProperty()
  access_token: string;
  @ApiProperty()
  user: Omit<User, 'passwordHash'> | null;
}

export class UserRefreshTokenResponse {
  @ApiProperty()
  access_token: string;
  @ApiProperty()
  refresh_token: string;
}

export class LogoutResponse {
  @ApiProperty({
    example: 'Logged out successfully',
    description: 'Status message',
  })
  message: string;
}

export class RequestResetPasswordResponse {
  @ApiProperty({
    example: 'Reset code sent to email',
    description: 'Status message',
  })
  message: string;
}

export class VerifyResetCodeResponse {
  @ApiProperty({
    example: 'Code verified successfully',
    description: 'Status message',
  })
  message: string;
}

export class ResetPasswordResponse {
  @ApiProperty({
    example: 'Password reset successfully',
    description: 'Status message',
  })
  message: string;
}

export class UserResponse {
  @ApiProperty({
    type: User,
    description: 'User object',
  })
  user: Omit<User, 'passwordHash'> | null;
}
