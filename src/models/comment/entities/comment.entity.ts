import { IComment } from 'src/models/comment/interface/comment.interface';

export class Comment implements IComment {
  lessonSubmissionId: string | null;
  identifierId: string;
  id: string;
  userId: string;
  content: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
