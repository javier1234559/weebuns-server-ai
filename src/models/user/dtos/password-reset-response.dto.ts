import { ApiProperty } from '@nestjs/swagger';

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
