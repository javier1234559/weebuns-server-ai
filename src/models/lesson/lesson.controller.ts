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
import {
  CreateLessonDto,
  UpdateLessonDto,
  FindAllLessonsDto,
} from './dto/lesson-request.dto';
import { SkillType } from '@prisma/client';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/common/decorators/role.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/models/user/entities/user.entity';
import { RolesGuard } from 'src/common/auth/role.guard';
import { AuthGuard } from 'src/common/auth/auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('lessons')
@Controller('lessons')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get()
  async findAll(@Query() query: FindAllLessonsDto) {
    return this.lessonService.findAll(query);
  }

  @Post('reading')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async createReading(@Body() dto: CreateLessonDto, @CurrentUser() user: User) {
    return this.lessonService.createLesson(SkillType.reading, dto, user.id);
  }

  @Get('reading/:id')
  async getReading(@Param('id') id: string) {
    return this.lessonService.findById(id);
  }

  @Patch('reading/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async updateReading(
    @Param('id') id: string,
    @Body() dto: UpdateLessonDto,
    @CurrentUser() user: User,
  ) {
    return this.lessonService.updateLesson(id, dto, user.id);
  }

  @Post('listening')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async createListening(
    @Body() dto: CreateLessonDto,
    @CurrentUser() user: User,
  ) {
    return this.lessonService.createLesson(SkillType.listening, dto, user.id);
  }

  @Get('listening/:id')
  async getListening(@Param('id') id: string) {
    return this.lessonService.findById(id);
  }

  @Patch('listening/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async updateListening(
    @Param('id') id: string,
    @Body() dto: UpdateLessonDto,
    @CurrentUser() user: User,
  ) {
    return this.lessonService.updateLesson(id, dto, user.id);
  }

  @Post('speaking')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async createSpeaking(
    @Body() dto: CreateLessonDto,
    @CurrentUser() user: User,
  ) {
    return this.lessonService.createLesson(SkillType.speaking, dto, user.id);
  }

  @Get('speaking/:id')
  async getSpeaking(@Param('id') id: string) {
    return this.lessonService.findById(id);
  }

  @Patch('speaking/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async updateSpeaking(
    @Param('id') id: string,
    @Body() dto: UpdateLessonDto,
    @CurrentUser() user: User,
  ) {
    return this.lessonService.updateLesson(id, dto, user.id);
  }

  @Post('writing')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async createWriting(@Body() dto: CreateLessonDto, @CurrentUser() user: User) {
    return this.lessonService.createLesson(SkillType.writing, dto, user.id);
  }

  @Get('writing/:id')
  async getWriting(@Param('id') id: string) {
    return this.lessonService.findById(id);
  }

  @Patch('writing/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async updateWriting(
    @Param('id') id: string,
    @Body() dto: UpdateLessonDto,
    @CurrentUser() user: User,
  ) {
    return this.lessonService.updateLesson(id, dto, user.id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async delete(@Param('id') id: string) {
    return this.lessonService.deleteLesson(id);
  }
}
