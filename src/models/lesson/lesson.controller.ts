import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LessonService } from './lesson.service';
import {
  CreateLessonDto,
  UpdateLessonDto,
  FindAllLessonsDto,
} from './dto/lesson-request.dto';
import { LessonResponseDto } from './dto/lesson-response.dto';
import { SkillType } from './interface/lesson.interface';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@ApiTags('lessons')
@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get()
  @ApiOperation({ summary: 'Get all lessons with search and filter' })
  async findAll(
    @Query() query: FindAllLessonsDto,
  ): Promise<LessonResponseDto[]> {
    return this.lessonService.findAll(query);
  }

  @Post('reading')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Create new reading lesson' })
  async createReading(
    @Body() dto: CreateLessonDto,
    @CurrentUser('id') userId: string,
  ): Promise<LessonResponseDto> {
    return this.lessonService.create(SkillType.READING, dto, userId);
  }

  @Get('reading/:id')
  @ApiOperation({ summary: 'Get reading lesson detail' })
  async getReading(@Param('id') id: string): Promise<LessonResponseDto> {
    return this.lessonService.findById(id, SkillType.READING);
  }

  @Patch('reading/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Update reading lesson' })
  async updateReading(
    @Param('id') id: string,
    @Body() dto: UpdateLessonDto,
    @CurrentUser('id') userId: string,
  ): Promise<LessonResponseDto> {
    return this.lessonService.update(id, SkillType.READING, dto, userId);
  }

  @Delete('reading/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Delete reading lesson' })
  async deleteReading(@Param('id') id: string): Promise<void> {
    return this.lessonService.delete(id, SkillType.READING);
  }

  // Similar endpoints for listening
  @Post('listening')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Create new listening lesson' })
  async createListening(
    @Body() dto: CreateLessonDto,
    @CurrentUser('id') userId: string,
  ): Promise<LessonResponseDto> {
    return this.lessonService.create(SkillType.LISTENING, dto, userId);
  }

  // ... Add other listening endpoints similarly
}
