import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthProvider, UserRole } from '@prisma/client';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { randomBytes } from 'crypto';
import { Response } from 'express';

import { IAuthPayload } from 'src/common/interface/auth-payload.interface';
import { MailService } from 'src/common/mail/mail.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LanguageUtil } from 'src/common/utils/language';
import config, {
  MAX_ACCESS_TOKEN_AGE,
  MAX_REFRESH_TOKEN_AGE,
} from 'src/config';
import {
  LogoutResponse,
  UserLoginResponse,
  UserRefreshTokenResponse,
  UserRegisterResponse,
  UserResponse,
} from 'src/user/dtos/auth-response.dto';
import { LoginGoogleDto } from 'src/user/dtos/login-google.dto';
import { LoginDto } from 'src/user/dtos/login.dto';
import { RegisterDto } from 'src/user/dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mailService: MailService,
  ) {}

  private generateTokens(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: config.jwt.jwtAccessSecret,
      expiresIn: MAX_ACCESS_TOKEN_AGE,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: config.jwt.jwtRefreshSecret,
      expiresIn: MAX_REFRESH_TOKEN_AGE,
    });
    return { accessToken, refreshToken };
  }

  async getCurrentUser(authPayload: IAuthPayload): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: String(authPayload.sub) },
    });

    return {
      user: user,
    };
  }

  async login(loginDto: LoginDto, res: Response): Promise<UserLoginResponse> {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.authProvider !== AuthProvider.local) {
      throw new UnauthorizedException('User is not registered with.local auth');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('The password is incorrect');
    }

    const { accessToken, refreshToken } = this.generateTokens(user);
    this.setRefreshTokenCookie(res, refreshToken);

    return {
      access_token: accessToken,
      user,
    };
  }

  async register(
    registerDto: RegisterDto,
    res: Response,
  ): Promise<UserRegisterResponse> {
    const { username, email, password, firstName, lastName, nativeLanguage } =
      registerDto;

    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ email }] },
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const mappedLanguage = LanguageUtil.mapISOToLanguageCode(nativeLanguage);
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await this.prisma.user.create({
        data: {
          username,
          email,
          passwordHash: hashedPassword,
          firstName: firstName,
          lastName: lastName,
          nativeLanguage: mappedLanguage,
          role: UserRole.user,
          authProvider: AuthProvider.local,
        },
      });

      const { accessToken, refreshToken } = this.generateTokens(newUser);
      this.setRefreshTokenCookie(res, refreshToken);

      return {
        access_token: accessToken,
        user: newUser,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException(
        `Something went wrong when creating the user ${error}`,
      );
    }
  }

  async loginGoogle(
    loginGoogleDto: LoginGoogleDto,
    res: Response,
  ): Promise<UserLoginResponse> {
    try {
      const accessToken = loginGoogleDto.accessToken;
      const { data: payload } = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid Google token');
      }

      const user = await this.findOrCreateUser({
        email: payload.email,
        name: payload.name,
        firstName: payload.given_name,
        lastName: payload.family_name,
        picture: payload.picture,
        provider: AuthProvider.google,
      });

      if (user.authProvider !== AuthProvider.google) {
        throw new BadRequestException(
          'User is not registered with Google auth',
        );
      }

      return this.generateAuthResponse(user, res);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // Re-throw BadRequestException
      }
      console.error('Error during Google login:', error);
      throw new UnauthorizedException('Google authentication failed');
    }
  }

  async loginFacebook(
    loginFacebookDto: LoginGoogleDto,
    res: Response,
  ): Promise<UserLoginResponse> {
    try {
      const accessToken = loginFacebookDto.accessToken;
      const { data: verifiedUserInfo } = await axios.get(
        'https://graph.facebook.com/me',
        {
          params: {
            fields: 'id,name,email,picture',
            access_token: accessToken,
          },
        },
      );

      if (!verifiedUserInfo || !verifiedUserInfo.email) {
        throw new UnauthorizedException('Invalid Facebook token');
      }

      const nameParts = verifiedUserInfo.name.split(' ');
      const user = await this.findOrCreateUser({
        email: verifiedUserInfo.email,
        name: verifiedUserInfo.name,
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' '),
        picture: verifiedUserInfo.picture?.data?.url,
        provider: AuthProvider.facebook,
      });

      if (user.authProvider !== AuthProvider.facebook) {
        throw new BadRequestException(
          'User is not registered with facebook auth',
        );
      }

      return this.generateAuthResponse(user, res);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // Re-throw BadRequestException
      }
      console.error('Error during Facebook login:', error);
      throw new UnauthorizedException('Facebook authentication failed');
    }
  }

  private async findOrCreateUser(userData: {
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    picture: string;
    provider: AuthProvider;
  }) {
    let user = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    const mappedLanguage = LanguageUtil.mapISOToLanguageCode('vi');

    if (!user) {
      // Create new user
      user = await this.prisma.user.create({
        data: {
          email: userData.email,
          username: userData.name,
          firstName: userData.firstName,
          lastName: userData.lastName,
          nativeLanguage: mappedLanguage,
          role: UserRole.user,
          authProvider: userData.provider,
          profilePicture: userData.picture,
        },
      });
    }

    return user;
  }

  private generateAuthResponse(user: any, res: Response): UserLoginResponse {
    const { accessToken, refreshToken } = this.generateTokens(user);
    this.setRefreshTokenCookie(res, refreshToken);

    return {
      access_token: accessToken,
      user,
    };
  }

  async refreshToken(
    refreshToken: string,
    res: Response,
  ): Promise<UserRefreshTokenResponse> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: config.jwt.jwtRefreshSecret,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const { accessToken, refreshToken: newRefreshToken } =
        this.generateTokens(user);

      this.setRefreshTokenCookie(res, newRefreshToken);
      console.log(newRefreshToken);

      return {
        access_token: accessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      console.log('Error:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  async logout(res: Response): Promise<LogoutResponse> {
    res.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    console.log(email);

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException('Email does not existing in db');
    }

    // Generate 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store code with 15min TTL
    await this.cacheManager.set(
      `reset_code:${email}`,
      resetCode,
      900_000, // 15 minutes
    );

    // Send email
    await this.mailService.sendPasswordResetEmail(email, resetCode);

    return { message: 'Reset code sent to email' };
  }

  async verifyResetCode(
    email: string,
    code: string,
  ): Promise<{ message: string }> {
    const storedCode = await this.cacheManager.get<string>(
      `reset_code:${email}`,
    );

    if (!storedCode || storedCode !== code) {
      throw new BadRequestException('Invalid or expired code');
    }

    // Generate verification token
    const resetToken = randomBytes(32).toString('hex');
    await this.cacheManager.set(
      `reset_token:${email}`,
      resetToken,
      300_000, // 5 minutes
    );

    return { message: 'Code verified successfully' };
  }

  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const storedCode = await this.cacheManager.get<string>(
      `reset_code:${email}`,
    );

    if (!storedCode || storedCode !== code) {
      throw new BadRequestException('Invalid or expired code');
    }

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { email },
      data: { passwordHash: hashedPassword },
    });

    // Cleanup
    await this.cacheManager.del(`reset_code:${email}`);

    return { message: 'Password reset successfully' };
  }
}
