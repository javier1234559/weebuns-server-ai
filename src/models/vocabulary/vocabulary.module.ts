import { Module } from '@nestjs/common';

import { PrismaService } from 'src/common/prisma/prisma.service';
import { VocabularyController } from 'src/models/vocabulary/restful/vocabulary.controller';
import { VocabularyService } from 'src/models/vocabulary/vocabulary.service';

@Module({
  controllers: [VocabularyController],
  providers: [VocabularyService, PrismaService],
  exports: [VocabularyService],
})
export class VocabularyModule {}
