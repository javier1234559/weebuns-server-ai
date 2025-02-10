import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { Prisma } from '@prisma/client';
import { Observable, from } from 'rxjs';

import { PrismaService } from '../prisma/prisma.service';

export const TRANSACTION_KEY = 'useTransaction';
export const UseTransaction = () => SetMetadata(TRANSACTION_KEY, true);

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const shouldUseTransaction = this.reflector.get(
      TRANSACTION_KEY,
      context.getHandler(),
    );

    if (!shouldUseTransaction) {
      return next.handle();
    }

    try {
      // Execute in transaction
      const result = await this.prisma.$transaction(
        async (tx) => {
          // Handle both REST and GraphQL contexts
          if (context.getType() === 'http') {
            // REST
            const request = context.switchToHttp().getRequest();
            request.prismaTransaction = tx;
          } else {
            // GraphQL
            const gqlContext = GqlExecutionContext.create(context);
            const ctx = gqlContext.getContext();
            ctx.prismaTransaction = tx;
          }

          return await next.handle().toPromise();
        },
        {
          maxWait: 5000,
          timeout: 10000,
          isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
        },
      );

      return from([result]);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2024':
            throw new InternalServerErrorException(
              'Operation timed out. Please try again.',
            );
          case 'P2034':
            throw new InternalServerErrorException(
              'Transaction failed. Please try again.',
            );
          default:
            throw new InternalServerErrorException(
              `Database error: ${error.message}`,
            );
        }
      }
      throw error;
    }
  }
}
