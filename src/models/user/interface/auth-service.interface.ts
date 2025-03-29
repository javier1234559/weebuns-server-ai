import { Response } from 'express';
import { IAuthPayload } from '../../../common/interface/auth-payload.interface';
import { AuthProvider } from '@prisma/client';
import {
  UserLoginResponse,
  UserRegisterResponse,
  UserRefreshTokenResponse,
  UserResponse,
} from '../dto/auth-response.dto';
import {
  LoginGoogleDto,
  RegisterDto,
} from 'src/models/user/dto/auth-request.dto';
import { LoginDto } from 'src/models/user/dto/auth-request.dto';

export interface AuthServiceInterface {
  getCurrentUser(authPayload: IAuthPayload): Promise<UserResponse>;
  login(loginDto: LoginDto, res: Response): Promise<UserLoginResponse>;
  register(
    registerDto: RegisterDto,
    res: Response,
  ): Promise<UserRegisterResponse>;
  loginGoogle(
    loginGoogleDto: LoginGoogleDto,
    res: Response,
  ): Promise<UserLoginResponse>;
  logout(res: Response): Promise<{ message: string }>;
  refreshToken(token: string, res: Response): Promise<UserRefreshTokenResponse>;
  requestPasswordReset(email: string): Promise<{ message: string }>;
  resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<{ message: string }>;
  validateUser(email: string, password: string): Promise<UserResponse>;
  socialLogin(provider: AuthProvider, profile: any): Promise<UserResponse>;
  verifyEmail(token: string): Promise<boolean>;
}
