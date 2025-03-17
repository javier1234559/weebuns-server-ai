import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';

import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { IAuthPayload } from 'src/common/interface/auth-payload.interface';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers?.authorization;
    if (!authHeader) {
      return undefined;
    }
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext) {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const token = this.extractTokenFromHeader(req);
    // console.log('Token extracted from header:', token);

    if (!token) throw new UnauthorizedException('No token provided.');

    try {
      const payload: IAuthPayload = await this.jwtService.verify(token);

      // Map sub to id để đảm bảo tính nhất quán khi sử dụng req.user.id
      req.user = {
        ...payload,
        id: payload.sub, // Thêm trường id từ sub
      };
      // console.log('User attached to request:', req.user);
      // console.log('Payload:', payload);

      //update last login time
      await this.prisma.user.update({
        where: { id: String(payload.sub) },
        data: { lastLogin: new Date() },
      });

      return true;
    } catch (error) {
      console.log('Error:', error);
      throw new UnauthorizedException('Invalid token provided.');
    }
  }
}

// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { GqlExecutionContext } from '@nestjs/graphql';
// import { JwtService } from '@nestjs/jwt';

// import { Request } from 'express';

// import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
// import { IAuthPayload } from 'src/common/interface/auth-payload.interface';
// import { PrismaService } from 'src/common/prisma/prisma.service';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly jwtService: JwtService,
//     private readonly reflector: Reflector,
//   ) {}

//   private extractTokenFromHeader(request: Request): string | undefined {
//     const authHeader = request.headers?.authorization;
//     if (!authHeader) {
//       return undefined;
//     }
//     const [type, token] = authHeader.split(' ');
//     return type === 'Bearer' ? token : undefined;
//   }

//   async canActivate(context: ExecutionContext) {
//     // Check if route is marked as public
//     const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);

//     if (isPublic) {
//       return true;
//     }

//     const ctx = GqlExecutionContext.create(context);
//     const { req } = ctx.getContext();

//     const token = this.extractTokenFromHeader(req);
//     // console.log('Token extracted from header:', token);

//     if (!token) throw new UnauthorizedException('No token provided.');

//     try {
//       const payload: IAuthPayload = await this.jwtService.verify(token);
//       req.user = payload;
//       // console.log('User attached to request:', req.user);
//       // console.log('Payload:', payload);

//       //update last login time
//       await this.prisma.user.update({
//         where: { id: String(payload.sub) },
//         data: { lastLogin: new Date() },
//       });

//       return true;
//     } catch (error) {
//       console.log('Error:', error);
//       throw new UnauthorizedException('Invalid token provided.');
//     }

//     // use with cookies approach
//     // https://docs.starton.com/tutorials/jwt-authentication-nest
//     // async canActivate(context: ExecutionContext): Promise<boolean> {
//     //   try {
//     //     // Try to retrieve the JWT from request's cookies
//     //     //--------------------------------------------------------------------------
//     //     const request: Request = context.switchToHttp().getRequest();

//     //     const token: string = request.cookies['jwt'];
//     //     if (!token) throw new UnauthorizedException();

//     //     // Verify the JWT and check if it has been revoked
//     //     //--------------------------------------------------------------------------
//     //     const payload: JwtPayload = await this.jwtService.verifyAsync(
//     //       request.cookies['jwt'],
//     //       { secret: process.env.JWT_SECRET },
//     //     );

//     //     if (
//     //       await this.prisma.revokedToken.findUnique({
//     //         where: { jti: payload.jti },
//     //       })
//     //     )
//     //       throw new UnauthorizedException();

//     //     // Attach user's data to the request
//     //     //--------------------------------------------------------------------------
//     //     request.user = payload;

//     //     return true;
//     //   } catch (err: unknown) {
//     //     throw new UnauthorizedException();
//     //   }
//     // }
//   }
// }
