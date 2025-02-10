import { Module } from '@nestjs/common';

import { ExistEntitiesConstraint } from 'src/common/decorators/exist-entities.decorator';
import { ExistEntityConstraint } from 'src/common/decorators/exist-entity.decorator';
import { ExistInDbByConstraint } from 'src/common/decorators/exist-in-db-by.decorator';
import { ExistInDbConstraint } from 'src/common/decorators/exist-in-db.decorator';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    ExistEntityConstraint,
    ExistEntitiesConstraint,
    ExistInDbByConstraint,
    ExistInDbConstraint,
  ],
  exports: [
    ExistEntityConstraint,
    ExistEntitiesConstraint,
    ExistInDbByConstraint,
    ExistInDbConstraint,
  ],
})
export class ValidationModule {}
