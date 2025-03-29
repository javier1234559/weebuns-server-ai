import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FindAllCommentsDto } from './dto/find-all-comment.dto';
import {
  CommentResponse,
  CommentsResponse,
  CreateCommentResponse,
  UpdateCommentResponse,
  DeleteCommentResponse,
} from './dto/comment-response.dto';
import { ICommentService } from './interface/comment.service.interface';
import { calculatePagination } from 'src/common/utils/pagination';
import {
  notDeletedQuery,
  paginationQuery,
} from 'src/common/helper/prisma-queries.helper';

@Injectable()
export class CommentService implements ICommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(
    userId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<CreateCommentResponse> {
    const comment = await this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        userId: userId,
        submissionId: createCommentDto.submissionId,
        parentId: createCommentDto.parentId,
      },
    });

    return { comment };
  }

  async findAll(
    findAllCommentsDto: FindAllCommentsDto,
  ): Promise<CommentsResponse> {
    const { page, perPage, submissionId } = findAllCommentsDto;

    const queryOptions = {
      where: {
        ...notDeletedQuery,
        submissionId,
        parentId: null, // Get only top-level comments
      },
      orderBy: { createdAt: 'desc' },
      ...paginationQuery(page, perPage),
    };

    const [comments, totalItems] = await Promise.all([
      this.prisma.comment.findMany(queryOptions),
      this.prisma.comment.count({ where: queryOptions.where }),
    ]);

    return {
      comments,
      pagination: calculatePagination(totalItems, findAllCommentsDto),
    };
  }

  async findOne(id: string): Promise<CommentResponse> {
    const comment = await this.prisma.comment.findUnique({
      where: { id, ...notDeletedQuery },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return { comment };
  }

  async update(
    id: string,
    userId: string,
    content: string,
  ): Promise<UpdateCommentResponse> {
    const comment = await this.prisma.comment.findFirst({
      where: { id, userId, ...notDeletedQuery },
    });

    if (!comment) {
      throw new NotFoundException(
        `Comment with ID ${id} not found or you don't have permission`,
      );
    }

    const updatedComment = await this.prisma.comment.update({
      where: { id },
      data: {
        content,
      },
    });

    return { comment: updatedComment };
  }

  async remove(id: string, userId: string): Promise<DeleteCommentResponse> {
    const comment = await this.prisma.comment.findFirst({
      where: { id, userId, ...notDeletedQuery },
    });

    if (!comment) {
      throw new NotFoundException(
        `Comment with ID ${id} not found or you don't have permission`,
      );
    }

    const deletedComment = await this.prisma.comment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { comment: deletedComment };
  }

  async findReplies(commentId: string): Promise<CommentResponse[]> {
    const replies = await this.prisma.comment.findMany({
      where: {
        parentId: commentId,
        ...notDeletedQuery,
      },
      orderBy: { createdAt: 'desc' },
    });

    return replies.map((reply) => ({ comment: reply }));
  }

  //   async addReaction(commentId: string, userId: string, type: string): Promise<void> {
  //     await this.prisma.commentReaction.create({
  //       data: {
  //         commentId,
  //         userId,
  //         type,
  //       },
  //     });
  //   }

  //   async removeReaction(commentId: string, userId: string, type: string): Promise<void> {
  //     await this.prisma.commentReaction.deleteMany({
  //       where: {
  //         commentId,
  //         userId,
  //         type,
  //       },
  //     });
  //   }
}
