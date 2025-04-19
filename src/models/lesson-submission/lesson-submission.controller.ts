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
import {
  FindAllLessonSubmissionQuery,
  FindAllReadingSubmissionsByUserQuery,
  CreateReadingSubmissionDTO,
  CreateListeningSubmissionDTO,
  CreateSpeakingSubmissionDTO,
  CreateWritingSubmissionDTO,
  UpdateWritingSubmissionDTO,
} from './dto/lesson-submission-request.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/common/decorators/role.decorator';
import { RolesGuard } from 'src/common/auth/role.guard';
import { AuthGuard } from 'src/common/auth/auth.guard';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import {
  LessonSubmissionsResponse,
  ReadingSubmissionResponse,
  ListeningSubmissionResponse,
  WritingSubmissionResponse,
  SpeakingSubmissionResponse,
  DeleteLessonSubmissionResponse,
  WritingSubmissionResultResponse,
} from './dto/lesson-submission-response.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { IAuthPayload } from 'src/common/interface/auth-payload.interface';

@ApiTags('lesson-submissions')
@Controller('lesson-submissions')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class LessonSubmissionController {
  constructor(
    private readonly lessonSubmissionService: LessonSubmissionService,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiResponse({ status: 200, type: LessonSubmissionsResponse })
  findAll(
    @Query() query: FindAllLessonSubmissionQuery,
  ): Promise<LessonSubmissionsResponse> {
    return this.lessonSubmissionService.findAllSubmissions(query);
  }

  @Get('user')
  @Roles(UserRole.USER)
  @ApiResponse({ status: 200, type: LessonSubmissionsResponse })
  getAllSubmissionsByUser(
    @Query() query: FindAllReadingSubmissionsByUserQuery,
    @CurrentUser() user: IAuthPayload,
  ): Promise<LessonSubmissionsResponse> {
    const userId = String(user.sub);
    console.log(userId);
    return this.lessonSubmissionService.getAllSubmissionsByUser(userId, query);
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
    const userId = String(user.sub);
    return this.lessonSubmissionService.createReadingSubmission(userId, dto);
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
    const userId = String(user.sub);
    return this.lessonSubmissionService.createListeningSubmission(userId, dto);
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
    const userId = String(user.sub);
    return this.lessonSubmissionService.createSpeakingSubmission(userId, dto);
  }

  @Get('writing/:id')
  @ApiResponse({ status: 200, type: WritingSubmissionResultResponse })
  findOneWriting(
    @Param('id') id: string,
  ): Promise<WritingSubmissionResultResponse> {
    return this.lessonSubmissionService.findOneWritingSubmission(id);
  }

  @Post('writing')
  @Roles(UserRole.USER)
  @ApiResponse({ status: 201, type: WritingSubmissionResponse })
  createWriting(
    @Body() dto: CreateWritingSubmissionDTO,
    @CurrentUser() user: IAuthPayload,
  ): Promise<WritingSubmissionResponse> {
    const userId = String(user.sub);
    return this.lessonSubmissionService.createWritingSubmission(userId, dto);
  }

  @Patch('writing/:id')
  @Roles(UserRole.TEACHER)
  @ApiResponse({ status: 200, type: WritingSubmissionResponse })
  updateWriting(
    @Param('id') id: string,
    @Body() dto: UpdateWritingSubmissionDTO,
    @CurrentUser() user: IAuthPayload,
  ): Promise<WritingSubmissionResponse> {
    const userId = String(user.sub);
    return this.lessonSubmissionService.updateWritingSubmission(
      id,
      userId,
      dto,
    );
  }
}
