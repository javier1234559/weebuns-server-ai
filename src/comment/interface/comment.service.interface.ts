import { Comment } from '@prisma/client';
import { CreateCommentDto } from '../dto/create-comment.dto';
import {
  CommentResponse,
  CommentsResponse,
  CreateCommentResponse,
  UpdateCommentResponse,
  DeleteCommentResponse,
} from '../dto/comment-response.dto';
import { FindAllCommentsDto } from '../dto/find-all-comment.dto';

export interface ICommentService {
  createComment(userId: string, createCommentDto: CreateCommentDto): Promise<CreateCommentResponse>;
  findAll(findAllCommentsDto: FindAllCommentsDto): Promise<CommentsResponse>;
  findOne(id: string): Promise<CommentResponse>;
  update(id: string, userId: string, content: string): Promise<UpdateCommentResponse>;
  remove(id: string, userId: string): Promise<DeleteCommentResponse>;
  findReplies(commentId: string): Promise<CommentResponse[]>;
  // addReaction(commentId: string, userId: string, type: string): Promise<void>;
  // removeReaction(commentId: string, userId: string, type: string): Promise<void>;
}