import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class RequestResetPasswordDto {
  @IsEmail()
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  email: string;
}

export class VerifyResetCodeDto {
  @IsEmail()
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  email: string;

  @IsString()
  @Length(6, 6)
  @ApiProperty({
    example: '123456',
    description: 'Six-digit verification code sent to email',
  })
  code: string;
}

export class ResetPasswordDto {
  @IsEmail()
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  email: string;

  @IsString()
  @Length(6, 6)
  @ApiProperty({
    example: '123456',
    description: 'Verification code for password reset',
  })
  code: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    example: 'newPassword123',
    description: 'New password (minimum 6 characters)',
  })
  newPassword: string;
}
