import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import {
  CreateCommentDto,
  FindAllCommentsDto,
  AddReactionDto,
  FindRepliesDto,
} from './dto/comment-request.dto';
import {
  CommentsResponse,
  CreateCommentResponse,
  DeleteCommentResponse,
  AddReactionResponse,
} from './dto/comment-response.dto';
import { AuthGuard } from 'src/common/auth/auth.guard';
import { RolesGuard } from 'src/common/auth/role.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { IAuthPayload } from 'src/common/interface/auth-payload.interface';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('comments')
@ApiTags('comments')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiResponse({
    status: 201,
    type: CreateCommentResponse,
  })
  create(
    @Body() data: CreateCommentDto,
    @CurrentUser() user: IAuthPayload,
  ): Promise<CreateCommentResponse> {
    const userId = String(user.sub);
    return this.commentService.create(data, userId);
  }

  @Get()
  @Public()
  @ApiResponse({
    status: 200,
    type: CommentsResponse,
  })
  findAll(
    @Query() query: FindAllCommentsDto,
    @Req() req: any,
  ): Promise<CommentsResponse> {
    const user = req.user as IAuthPayload;
    console.log(user);
    const userId = user ? String(user.sub) : undefined;
    return this.commentService.findAll(query, userId);
  }

  @Get('replies')
  @Public()
  @ApiResponse({
    status: 200,
    type: CommentsResponse,
  })
  findReplies(
    @Query() query: FindRepliesDto,
    @Req() req: any,
  ): Promise<CommentsResponse> {
    const user = req.user as IAuthPayload;
    const userId = user ? String(user.sub) : undefined;
    return this.commentService.findReplies(query, userId);
  }

  @Post(':id/reactions')
  @ApiResponse({
    status: 200,
    type: AddReactionResponse,
  })
  addReaction(
    @Param('id') commentId: string,
    @Body() data: AddReactionDto,
    @CurrentUser() user: IAuthPayload,
  ): Promise<AddReactionResponse> {
    const userId = String(user.sub);
    return this.commentService.addReaction(data, commentId, userId);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: DeleteCommentResponse,
  })
  delete(
    @Param('id') id: string,
    @CurrentUser() user: IAuthPayload,
  ): Promise<DeleteCommentResponse> {
    const userId = String(user.sub);
    return this.commentService.delete(id, userId);
  }
}
