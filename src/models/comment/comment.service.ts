import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ICommentService } from './interface/comment-service.interface';
import {
  CreateCommentDto,
  FindAllCommentsDto,
  AddReactionDto,
  FindRepliesDto,
} from './dto/comment-request.dto';
import {
  CreateCommentResponse,
  CommentsResponse,
  DeleteCommentResponse,
  AddReactionResponse,
} from './dto/comment-response.dto';
import {
  notDeletedQuery,
  paginationQuery,
  softDeleteQuery,
} from 'src/common/helper/prisma-queries.helper';
import { calculatePagination } from 'src/common/utils/pagination';
import { ReactionType } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getCommentIdentifierId } from './helper';

@Injectable()
export class CommentService implements ICommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private readonly commentIncludeQuery = {
    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          profilePicture: true,
          role: true,
        },
      },
      reactions: true,
      _count: {
        select: {
          replies: true,
        },
      },
    },
  };

  private transformCommentResponse(comment: any, userId?: string) {
    const likesCount = comment.reactions.filter(
      (r: any) => r.type === ReactionType.like,
    ).length;
    const lovesCount = comment.reactions.filter(
      (r: any) => r.type === ReactionType.teacher_heart,
    ).length;
    const userReaction = userId
      ? comment.reactions.find((r: any) => r.userId === userId)?.type
      : null;

    return {
      ...comment,
      likesCount,
      lovesCount,
      hasReplies: comment._count.replies > 0,
      userReaction,
    };
  }

  private async handleCommentNotification(
    comment: any,
    data: CreateCommentDto,
  ) {
    try {
      if (data.parentId) {
        // Handle reply notification
        const parentComment = await this.prisma.comment.findUnique({
          where: { id: data.parentId },
        });

        if (!parentComment) {
          console.error(
            'Parent comment not found for notification:',
            data.parentId,
          );
          return;
        }

        this.eventEmitter.emit('comment.replied', {
          createdBy: comment.userId,
          userId: parentComment.userId,
          title: 'Bạn có lượt trả lời cho bình luận ' + parentComment.content,
          content: comment.content,
          thumbnailUrl: comment.user.profilePicture,
          actionUrl: comment.actionLink || '',
        });
      } else {
        // Handle new comment notification
        const identifierId = getCommentIdentifierId(data.identifierId);
        if (identifierId) {
          const lesson = await this.prisma.lesson.findFirst({
            where: {
              id: identifierId,
              ...notDeletedQuery,
            },
          });

          if (!lesson) {
            console.error('Lesson not found for notification:', identifierId);
            return;
          }

          this.eventEmitter.emit('comment.created', {
            createdBy: comment.userId,
            userId: lesson.createdById,
            title: 'Bạn có bình luận mới tại bài học ' + lesson.title,
            content: comment.content,
            thumbnailUrl: comment.user.profilePicture,
            actionUrl: comment.actionLink || '',
          });
        }
      }
    } catch (error) {
      // Log error but don't throw to prevent affecting comment creation
      console.error('Error handling comment notification:', error);
    }
  }

  async create(
    data: CreateCommentDto,
    userId: string,
  ): Promise<CreateCommentResponse> {
    const comment = await this.prisma.comment.create({
      data: {
        identifierId: data.identifierId,
        parentId: data.parentId ?? null,
        content: data.content,
        userId,
        actionLink: data.actionLink ?? null,
      },
      ...this.commentIncludeQuery,
    });

    // Handle notification asynchronously
    this.handleCommentNotification(comment, data).catch((error) => {
      console.error('Failed to handle comment notification:', error);
    });

    return {
      comment: this.transformCommentResponse(comment, userId),
    };
  }

  async findAll(
    query: FindAllCommentsDto,
    userId?: string,
  ): Promise<CommentsResponse> {
    const { page, perPage, identifierId } = query;

    const queryOptions = {
      where: {
        ...notDeletedQuery,
        identifierId,
        parentId: null, // Only get top-level comments
      },
      orderBy: { createdAt: 'desc' },
      ...paginationQuery(page, perPage),
      ...this.commentIncludeQuery,
    };

    const [comments, totalItems] = await Promise.all([
      this.prisma.comment.findMany(queryOptions),
      this.prisma.comment.count({ where: queryOptions.where }),
    ]);

    return {
      data: comments.map((comment) =>
        this.transformCommentResponse(comment, userId),
      ),
      pagination: calculatePagination(totalItems, query),
    };
  }

  async findReplies(
    query: FindRepliesDto,
    userId?: string,
  ): Promise<CommentsResponse> {
    const { page, perPage, commentId } = query;

    const queryOptions = {
      where: {
        ...notDeletedQuery,
        parentId: commentId,
      },
      orderBy: { createdAt: 'asc' },
      ...paginationQuery(page, perPage),
      ...this.commentIncludeQuery,
    };

    const [comments, totalItems] = await Promise.all([
      this.prisma.comment.findMany(queryOptions),
      this.prisma.comment.count({ where: queryOptions.where }),
    ]);

    return {
      data: comments.map((comment) =>
        this.transformCommentResponse(comment, userId),
      ),
      pagination: calculatePagination(totalItems, query),
    };
  }

  async addReaction(
    data: AddReactionDto,
    commentId: string,
    userId: string,
  ): Promise<AddReactionResponse> {
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId, ...notDeletedQuery },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    // Check if user already has a reaction of this type
    console.log('test' + userId);
    const existingReaction = await this.prisma.commentReaction.findFirst({
      where: {
        commentId,
        userId,
        type: data.type as ReactionType,
      },
    });

    if (existingReaction) {
      // If reaction exists, remove it (toggle off)
      await this.prisma.commentReaction.delete({
        where: {
          id: existingReaction.id,
        },
      });
      return { message: 'Reaction removed successfully' };
    } else {
      // If no reaction exists, add it (toggle on)
      await this.prisma.commentReaction.create({
        data: {
          commentId,
          userId,
          type: data.type as ReactionType,
        },
      });
      return { message: 'Reaction added successfully' };
    }
  }

  async delete(id: string, userId: string): Promise<DeleteCommentResponse> {
    const comment = await this.prisma.comment.findFirst({
      where: { id, userId, ...notDeletedQuery },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    //check owner
    if (comment.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to delete this comment',
      );
    }

    // Check if comment has replies
    const hasReplies = await this.prisma.comment.count({
      where: { parentId: id, ...notDeletedQuery },
    });

    if (hasReplies > 0) {
      // If has replies, perform soft delete
      await this.prisma.comment.update({
        where: { id },
        data: {
          ...softDeleteQuery,
        },
      });
    } else {
      // If no replies, delete from database
      await this.prisma.comment.delete({
        where: { id },
      });
    }

    return { message: 'Comment deleted successfully' };
  }
}
