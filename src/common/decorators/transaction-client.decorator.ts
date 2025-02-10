import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const TransactionClient = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    if (context.getType() === 'http') {
      // REST
      const request = context.switchToHttp().getRequest();
      return request.prismaTransaction;
    } else {
      // GraphQL
      const ctx = GqlExecutionContext.create(context).getContext();
      return ctx.prismaTransaction;
    }
  },
);
