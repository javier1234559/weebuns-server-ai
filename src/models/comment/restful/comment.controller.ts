import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Put,
  Post,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Request } from 'express';
import { AuthGuard } from 'src/common/auth/auth.guard';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { FindAllCommentsDto } from '../dto/find-all-comment.dto';
import {
  CommentResponse,
  CommentsResponse,
  CreateCommentResponse,
  UpdateCommentResponse,
  DeleteCommentResponse,
} from '../dto/comment-response.dto';
import { CommentService } from '../comment.service';

@Controller('comments')
@ApiTags('comments')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateCommentResponse,
  })
  async create(
    @Req() req: Request,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CreateCommentResponse> {
    return this.commentService.createComment(req.user.sub, createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiQuery({
    type: FindAllCommentsDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CommentsResponse,
  })
  async findAll(
    @Query() findAllCommentsDto: FindAllCommentsDto,
  ): Promise<CommentsResponse> {
    return this.commentService.findAll(findAllCommentsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CommentResponse,
  })
  async findOne(@Param('id') id: string): Promise<CommentResponse> {
    return this.commentService.findOne(id);
  }

  @Get(':id/replies')
  @ApiOperation({ summary: 'Get all replies for a comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [CommentResponse],
  })
  async findReplies(@Param('id') id: string): Promise<CommentResponse[]> {
    return this.commentService.findReplies(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({
    name: 'id',
    description: 'Comment ID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UpdateCommentResponse,
  })
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body('content') content: string,
  ): Promise<UpdateCommentResponse> {
    return this.commentService.update(id, req.user.id, content);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({
    name: 'id',
    description: 'Comment ID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DeleteCommentResponse,
  })
  async remove(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<DeleteCommentResponse> {
    return this.commentService.remove(id, req.user.id);
  }
}
