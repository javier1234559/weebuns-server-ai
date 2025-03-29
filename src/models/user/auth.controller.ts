import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/common/auth/auth.guard';
import { AuthService } from 'src/models/user/auth.service';
import {
  RegisterDto,
  LoginDto,
  LoginGoogleDto,
  LoginFacebookDto,
  RequestResetPasswordDto,
  VerifyResetCodeDto,
  ResetPasswordDto,
} from 'src/models/user/dto/auth-request.dto';
import {
  LogoutResponse,
  RequestResetPasswordResponse,
  ResetPasswordResponse,
  UserLoginResponse,
  UserRefreshTokenResponse,
  UserRegisterResponse,
  UserResponse,
  VerifyResetCodeResponse,
} from 'src/models/user/dto/auth-response.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile retrieved successfully',
    type: UserResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async me(@Req() req: Request): Promise<UserResponse> {
    return this.authService.getCurrentUser(req.user);
  }

  @Post('register')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
    type: UserRegisterResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid registration data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already exists',
  })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserRegisterResponse> {
    return this.authService.register(registerDto, res);
  }

  @Post('login')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
    type: UserLoginResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserLoginResponse> {
    return this.authService.login(loginDto, res);
  }

  @Post('login/google')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Google login successful',
    type: UserLoginResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid Google token',
  })
  async loginWithGoogle(
    @Body() loginDto: LoginGoogleDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserLoginResponse> {
    return this.authService.loginGoogle(loginDto, res);
  }

  @Post('login/facebook')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Facebook login successful',
    type: UserLoginResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid Facebook token',
  })
  async loginWithFacebook(
    @Body() loginDto: LoginFacebookDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserLoginResponse> {
    return this.authService.loginFacebook(loginDto, res);
  }

  @Post('refresh-token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token refreshed successfully',
    type: UserRefreshTokenResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid refresh token',
  })
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserRefreshTokenResponse> {
    const refreshToken = req.cookies['refreshToken'];
    return this.authService.refreshToken(refreshToken, res);
  }

  @Post('logout')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logout successful',
    type: LogoutResponse,
  })
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<LogoutResponse> {
    return this.authService.logout(res);
  }

  @Post('password-reset/request')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reset code sent successfully',
    type: RequestResetPasswordResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid email',
  })
  async requestPasswordReset(
    @Body() requestDto: RequestResetPasswordDto,
  ): Promise<RequestResetPasswordResponse> {
    return this.authService.requestPasswordReset(requestDto.email);
  }

  @Post('password-reset/verify')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Code verified successfully',
    type: VerifyResetCodeResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or expired code',
  })
  async verifyResetCode(
    @Body() verifyDto: VerifyResetCodeDto,
  ): Promise<VerifyResetCodeResponse> {
    return this.authService.verifyResetCode(verifyDto.email, verifyDto.code);
  }

  @Post('password-reset/reset')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset successfully',
    type: ResetPasswordResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or expired code',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid password format',
  })
  async resetPassword(
    @Body() resetDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    return this.authService.resetPassword(
      resetDto.email,
      resetDto.code,
      resetDto.newPassword,
    );
  }
}
