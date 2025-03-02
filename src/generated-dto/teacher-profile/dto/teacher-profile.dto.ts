import { Prisma, SkillType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class TeacherProfileDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    isArray: true,
    enum: SkillType,
    enumName: 'SkillType',
  })
  specialization: SkillType[];
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  qualification: string | null;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    nullable: true,
  })
  teachingExperience: number | null;
  @ApiProperty({
    type: 'string',
    format: 'Decimal.js',
    nullable: true,
  })
  hourlyRate: Prisma.Decimal | null;
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
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  deletedAt: Date | null;
}
