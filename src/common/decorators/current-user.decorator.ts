import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { IAuthPayload } from 'src/common/interface/auth-payload.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof IAuthPayload | undefined, context: ExecutionContext) => {
    let user;
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      user = request.user;
    } else {
      const ctx = GqlExecutionContext.create(context);
      user = ctx.getContext().req.user;
    }

    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    return data ? user?.[data] : user;
  },
);
