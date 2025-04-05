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
import { LessonService } from './lesson.service';
import { FindAllLessonQuery } from './dto/lesson-request.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/common/decorators/role.decorator';
import { RolesGuard } from 'src/common/auth/role.guard';
import { AuthGuard } from 'src/common/auth/auth.guard';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import {
  CreateReadingDTO,
  UpdateReadingDTO,
  CreateListeningDTO,
  UpdateListeningDTO,
  CreateWritingDTO,
  UpdateWritingDTO,
  CreateSpeakingDTO,
  UpdateSpeakingDTO,
} from './dto/lesson-request.dto';
import {
  LessonsResponse,
  ReadingResponse,
  ListeningResponse,
  WritingResponse,
  SpeakingResponse,
  DeleteLessonResponse,
} from './dto/lesson-response.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { IAuthPayload } from 'src/common/interface/auth-payload.interface';

@ApiTags('lessons')
@Controller('lessons')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get()
  @ApiResponse({ status: 200, type: LessonsResponse })
  findAll(@Query() query: FindAllLessonQuery): Promise<LessonsResponse> {
    return this.lessonService.findAll(query);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiResponse({ status: 200, type: DeleteLessonResponse })
  remove(@Param('id') id: string): Promise<DeleteLessonResponse> {
    return this.lessonService.delete(id);
  }

  @Get('reading/:id')
  @ApiResponse({ status: 200, type: ReadingResponse })
  findOneReading(@Param('id') id: string): Promise<ReadingResponse> {
    return this.lessonService.findOneReading(id);
  }

  @Post('reading')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiResponse({ status: 201, type: ReadingResponse })
  createReading(
    @Body() dto: CreateReadingDTO,
    @CurrentUser() user: IAuthPayload,
  ): Promise<ReadingResponse> {
    dto.createdById = String(user.sub);
    return this.lessonService.createReading(dto);
  }

  @Patch('reading/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiResponse({ status: 200, type: ReadingResponse })
  updateReading(
    @Param('id') id: string,
    @Body() dto: UpdateReadingDTO,
    @CurrentUser() user: IAuthPayload,
  ): Promise<ReadingResponse> {
    dto.createdById = String(user.sub);
    return this.lessonService.updateReading(id, dto);
  }

  @Get('listening/:id')
  @ApiResponse({ status: 200, type: ListeningResponse })
  findOneListening(@Param('id') id: string): Promise<ListeningResponse> {
    return this.lessonService.findOneListening(id);
  }

  @Post('listening')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiResponse({ status: 201, type: ListeningResponse })
  createListening(
    @Body() dto: CreateListeningDTO,
    @CurrentUser() user: IAuthPayload,
  ): Promise<ListeningResponse> {
    dto.createdById = String(user.sub);
    return this.lessonService.createListening(dto);
  }

  @Patch('listening/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiResponse({ status: 200, type: ListeningResponse })
  updateListening(
    @Param('id') id: string,
    @Body() dto: UpdateListeningDTO,
    @CurrentUser() user: IAuthPayload,
  ): Promise<ListeningResponse> {
    dto.createdById = String(user.sub);
    return this.lessonService.updateListening(id, dto);
  }

  @Get('writing/:id')
  @ApiResponse({ status: 200, type: WritingResponse })
  findOneWriting(@Param('id') id: string): Promise<WritingResponse> {
    return this.lessonService.findOneWriting(id);
  }

  @Post('writing')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiResponse({ status: 201, type: WritingResponse })
  createWriting(
    @Body() dto: CreateWritingDTO,
    @CurrentUser() user: IAuthPayload,
  ): Promise<WritingResponse> {
    dto.createdById = String(user.sub);
    return this.lessonService.createWriting(dto);
  }

  @Patch('writing/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiResponse({ status: 200, type: WritingResponse })
  updateWriting(
    @Param('id') id: string,
    @Body() dto: UpdateWritingDTO,
    @CurrentUser() user: IAuthPayload,
  ): Promise<WritingResponse> {
    dto.createdById = String(user.sub);
    return this.lessonService.updateWriting(id, dto);
  }

  @Get('speaking/:id')
  @ApiResponse({ status: 200, type: SpeakingResponse })
  findOneSpeaking(@Param('id') id: string): Promise<SpeakingResponse> {
    return this.lessonService.findOneSpeaking(id);
  }

  @Post('speaking')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiResponse({ status: 201, type: SpeakingResponse })
  createSpeaking(
    @Body() dto: CreateSpeakingDTO,
    @CurrentUser() user: IAuthPayload,
  ): Promise<SpeakingResponse> {
    dto.createdById = String(user.sub);
    return this.lessonService.createSpeaking(dto);
  }

  @Patch('speaking/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiResponse({ status: 200, type: SpeakingResponse })
  updateSpeaking(
    @Param('id') id: string,
    @Body() dto: UpdateSpeakingDTO,
  ): Promise<SpeakingResponse> {
    return this.lessonService.updateSpeaking(id, dto);
  }
}
