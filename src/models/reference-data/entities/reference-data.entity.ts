import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Lesson } from '../../lesson/entities/lesson.entity';

export class ReferenceData {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  type: string;
  @ApiProperty({
    type: 'string',
  })
  code: string;
  @ApiProperty({
    type: 'string',
  })
  name: string;
  @ApiProperty({
    type: () => Object,
    nullable: true,
  })
  metadata: Prisma.JsonValue | null;
  @ApiProperty({
    type: 'boolean',
  })
  isActive: boolean;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  orderIndex: number;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
  @ApiProperty({
    type: () => Lesson,
    isArray: true,
    required: false,
  })
  lessons?: Lesson[];
}
