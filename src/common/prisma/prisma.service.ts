import { Injectable, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

import { createSoftDeleteMiddleware } from 'src/common/prisma/soft-delete.middleware';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
    this.$use(createSoftDeleteMiddleware(this));
  }

  async onModuleInit() {
    await this.$connect();
  }
}
