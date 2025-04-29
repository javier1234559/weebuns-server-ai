import {
  CreateCommentDto,
  FindAllCommentsDto,
  AddReactionDto,
  FindRepliesDto,
} from '../dto/comment-request.dto';
import {
  CreateCommentResponse,
  CommentsResponse,
  DeleteCommentResponse,
  AddReactionResponse,
} from '../dto/comment-response.dto';

export interface ICommentService {
  create(
    data: CreateCommentDto,
    userId: string,
  ): Promise<CreateCommentResponse>;
  findAll(
    query: FindAllCommentsDto,
    userId?: string,
  ): Promise<CommentsResponse>;
  findReplies(
    query: FindRepliesDto,
    userId?: string,
  ): Promise<CommentsResponse>;
  addReaction(
    data: AddReactionDto,
    commentId: string,
    userId: string,
  ): Promise<AddReactionResponse>;
  delete(id: string, userId: string): Promise<DeleteCommentResponse>;
}
