import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LessonSubmissionService } from './lesson-submission.service';
import { FindAllLessonSubmissionQuery } from './dto/lesson-submission-request.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/common/decorators/role.decorator';
import { RolesGuard } from 'src/common/auth/role.guard';
import { AuthGuard } from 'src/common/auth/auth.guard';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import {
  CreateReadingSubmissionDTO,
  UpdateReadingSubmissionDTO,
  CreateListeningSubmissionDTO,
  UpdateListeningSubmissionDTO,
  CreateWritingSubmissionDTO,
  UpdateWritingSubmissionDTO,
  CreateSpeakingSubmissionDTO,
  UpdateSpeakingSubmissionDTO,
} from './dto/lesson-submission-request.dto';
import {
  LessonSubmissionsResponse,
  ReadingSubmissionResponse,
  ListeningSubmissionResponse,
  WritingSubmissionResponse,
  SpeakingSubmissionResponse,
  DeleteLessonSubmissionResponse,
} from './dto/lesson-submission-response.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { IAuthPayload } from 'src/common/interface/auth-payload.interface';
import { FeedbackDTO } from './dto/feedback.dto';

@ApiTags('lesson-submissions')
@Controller('lesson-submissions')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class LessonSubmissionController {
  constructor(
    private readonly lessonSubmissionService: LessonSubmissionService,
  ) {}

  @Get()
  @ApiResponse({ status: 200, type: LessonSubmissionsResponse })
  findAll(
    @Query() query: FindAllLessonSubmissionQuery,
  ): Promise<LessonSubmissionsResponse> {
    return this.lessonSubmissionService.findAllSubmissions(query);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiResponse({ status: 200, type: DeleteLessonSubmissionResponse })
  remove(@Param('id') id: string): Promise<DeleteLessonSubmissionResponse> {
    return this.lessonSubmissionService.delete(id);
  }

  @Get('reading/:id')
  @ApiResponse({ status: 200, type: ReadingSubmissionResponse })
  findOneReading(@Param('id') id: string): Promise<ReadingSubmissionResponse> {
    return this.lessonSubmissionService.findOneReadingSubmission(id);
  }

  @Post('reading')
  @Roles(UserRole.USER)
  @ApiResponse({ status: 201, type: ReadingSubmissionResponse })
  createReading(
    @Body() dto: CreateReadingSubmissionDTO,
    @CurrentUser() user: IAuthPayload,
  ): Promise<ReadingSubmissionResponse> {
    dto.userId = String(user.sub);
    return this.lessonSubmissionService.createReadingSubmission(dto);
  }

  @Patch('reading/:id')
  @Roles(UserRole.USER)
  @ApiResponse({ status: 200, type: ReadingSubmissionResponse })
  updateReading(
    @Param('id') id: string,
    @Body() dto: UpdateReadingSubmissionDTO,
  ): Promise<ReadingSubmissionResponse> {
    return this.lessonSubmissionService.updateReadingSubmission(id, dto);
  }

  @Get('listening/:id')
  @ApiResponse({ status: 200, type: ListeningSubmissionResponse })
  findOneListening(
    @Param('id') id: string,
  ): Promise<ListeningSubmissionResponse> {
    return this.lessonSubmissionService.findOneListeningSubmission(id);
  }

  @Post('listening')
  @Roles(UserRole.USER)
  @ApiResponse({ status: 201, type: ListeningSubmissionResponse })
  createListening(
    @Body() dto: CreateListeningSubmissionDTO,
    @CurrentUser() user: IAuthPayload,
  ): Promise<ListeningSubmissionResponse> {
    dto.userId = String(user.sub);
    return this.lessonSubmissionService.createListeningSubmission(dto);
  }

  @Patch('listening/:id')
  @Roles(UserRole.USER)
  @ApiResponse({ status: 200, type: ListeningSubmissionResponse })
  updateListening(
    @Param('id') id: string,
    @Body() dto: UpdateListeningSubmissionDTO,
  ): Promise<ListeningSubmissionResponse> {
    return this.lessonSubmissionService.updateListeningSubmission(id, dto);
  }

  @Get('writing/:id')
  @ApiResponse({ status: 200, type: WritingSubmissionResponse })
  findOneWriting(@Param('id') id: string): Promise<WritingSubmissionResponse> {
    return this.lessonSubmissionService.findOneWritingSubmission(id);
  }

  @Post('writing')
  @Roles(UserRole.USER)
  @ApiResponse({ status: 201, type: WritingSubmissionResponse })
  createWriting(
    @Body() dto: CreateWritingSubmissionDTO,
    @CurrentUser() user: IAuthPayload,
  ): Promise<WritingSubmissionResponse> {
    dto.userId = String(user.sub);
    return this.lessonSubmissionService.createWritingSubmission(dto);
  }

  @Patch('writing/:id')
  @Roles(UserRole.USER)
  @ApiResponse({ status: 200, type: WritingSubmissionResponse })
  updateWriting(
    @Param('id') id: string,
    @Body() dto: UpdateWritingSubmissionDTO,
  ): Promise<WritingSubmissionResponse> {
    return this.lessonSubmissionService.updateWritingSubmission(id, dto);
  }

  @Get('speaking/:id')
  @ApiResponse({ status: 200, type: SpeakingSubmissionResponse })
  findOneSpeaking(
    @Param('id') id: string,
  ): Promise<SpeakingSubmissionResponse> {
    return this.lessonSubmissionService.findOneSpeakingSubmission(id);
  }

  @Post('speaking')
  @Roles(UserRole.USER)
  @ApiResponse({ status: 201, type: SpeakingSubmissionResponse })
  createSpeaking(
    @Body() dto: CreateSpeakingSubmissionDTO,
    @CurrentUser() user: IAuthPayload,
  ): Promise<SpeakingSubmissionResponse> {
    dto.userId = String(user.sub);
    return this.lessonSubmissionService.createSpeakingSubmission(dto);
  }

  @Patch('speaking/:id')
  @Roles(UserRole.USER)
  @ApiResponse({ status: 200, type: SpeakingSubmissionResponse })
  updateSpeaking(
    @Param('id') id: string,
    @Body() dto: UpdateSpeakingSubmissionDTO,
  ): Promise<SpeakingSubmissionResponse> {
    return this.lessonSubmissionService.updateSpeakingSubmission(id, dto);
  }

  @Patch('writing/:id/feedback')
  @Roles(UserRole.TEACHER)
  @ApiResponse({ status: 200, type: WritingSubmissionResponse })
  updateWritingFeedback(
    @Param('id') id: string,
    @Body() dto: FeedbackDTO,
    @CurrentUser() user: IAuthPayload,
  ): Promise<WritingSubmissionResponse> {
    return this.lessonSubmissionService.updateWritingTeacherFeedback(
      id,
      dto,
      String(user.sub),
    );
  }
}
