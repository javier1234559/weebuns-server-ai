import { ApiProperty } from '@nestjs/swagger';
import { IComment } from 'src/models/comment/interface/comment.interface copy';

export class Comment implements IComment {
  @ApiProperty()
  lessonSubmissionId: string | null;

  @ApiProperty()
  identifierId: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  parentId: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date | null;
}
