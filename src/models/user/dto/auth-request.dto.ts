import { ApiProperty } from '@nestjs/swagger';

import {
  IsEmail,
  IsString,
  Length,
  MinLength,
  IsOptional,
} from 'class-validator';

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

export class LoginGoogleDto {
  @IsString()
  //docs
  @ApiProperty()
  accessToken: string;
}

export class LoginFacebookDto {
  @IsString()
  //docs
  @ApiProperty()
  accessToken: string;
}

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

export class RegisterDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @MinLength(6)
  @ApiProperty()
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  lastName?: string;
}

export class RegisterGoogleDto {
  @IsString()
  //docs
  @ApiProperty()
  uuid: string;
}
