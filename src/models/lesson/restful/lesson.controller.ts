import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Query,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/auth/auth.guard';
import { RolesGuard } from 'src/common/auth/role.guard';
import { Roles, UserRole } from 'src/common/decorators/role.decorator';
import { CreateLessonDto } from 'src/models/lesson/dto/create-lesson.dto';
import { PaginatedLessonsResponseDto } from 'src/models/lesson/dto/paginated-lessons-response.dto';
import { QueryLessonDto } from 'src/models/lesson/dto/query-lesson.dto';
import { ResponseLessonDto } from 'src/models/lesson/dto/lesson-response.dto';
import { UpdateLessonDto } from 'src/models/lesson/dto/update-lesson.dto';
import { LessonService } from 'src/models/lesson/lesson.service';

@Controller('lessons')
@ApiTags('lessons')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Create a new lesson' })
  @ApiResponse({
    status: 201,
    description: 'Lesson created successfully',
    type: ResponseLessonDto,
  })
  async createLesson(
    @Request() req,
    @Body() createLessonDto: CreateLessonDto,
  ): Promise<ResponseLessonDto> {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.lessonService.createLesson(userId, userRole, createLessonDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.USER)
  @ApiOperation({ summary: 'Get all lessons with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated lessons',
    type: PaginatedLessonsResponseDto,
  })
  async getLessons(
    @Request() req,
    @Query() queryDto: QueryLessonDto,
  ): Promise<PaginatedLessonsResponseDto> {
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
      return await this.lessonService.getLessons(userId, userRole, queryDto);
    } catch (error) {
      console.error('Error in getLessons:', error);
      throw error;
    }
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.USER)
  @ApiOperation({ summary: 'Get a lesson by ID' })
  @ApiParam({ name: 'id', description: 'Lesson ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the lesson',
    type: ResponseLessonDto,
  })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  async getLessonById(
    @Request() req,
    @Param('id') id: string,
  ): Promise<ResponseLessonDto> {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.lessonService.getLessonById(id, userId, userRole);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Update a lesson (partial update)' })
  @ApiParam({ name: 'id', description: 'Lesson ID' })
  @ApiResponse({
    status: 200,
    description: 'Lesson updated successfully',
    type: ResponseLessonDto,
  })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateLesson(
    @Request() req,
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<ResponseLessonDto> {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.lessonService.updateLesson(
      id,
      userId,
      userRole,
      updateLessonDto,
    );
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Delete a lesson (soft delete)' })
  @ApiParam({ name: 'id', description: 'Lesson ID' })
  @ApiResponse({
    status: 200,
    description: 'Lesson marked as deleted',
    type: ResponseLessonDto,
  })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteLesson(
    @Request() req,
    @Param('id') id: string,
  ): Promise<ResponseLessonDto> {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.lessonService.deleteLesson(id, userId, userRole);
  }
}
