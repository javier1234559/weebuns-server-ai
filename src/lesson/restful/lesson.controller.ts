import {
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/auth/auth.guard';
import { RolesGuard } from 'src/common/auth/role.guard';
import { Roles, UserRole } from 'src/common/decorators/role.decorator';
import { CreateLessonDto } from 'src/lesson/dto/create-lesson.dto';
import { LessonResponseDto } from 'src/lesson/dto/lesson-response.dto';
import { ListLessonQueryDto } from 'src/lesson/dto/list-lesson-query.dto';
import { PaginatedResponseDto } from 'src/lesson/dto/paginated-lesson-response.dto';
import { UpdateLessonDto } from 'src/lesson/dto/update-lesson.dto';
import { LessonService } from 'src/lesson/lesson.service';

@ApiTags('lessons')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new lesson' })
  @ApiResponse({
    status: 201,
    description: 'Lesson created successfully',
    type: LessonResponseDto,
  })
  async create(
    @Request() req,
    @Body() createLessonDto: CreateLessonDto,
  ): Promise<LessonResponseDto> {
    const lesson = await this.lessonService.create(
      req.user.id,
      createLessonDto,
    );
    return new LessonResponseDto(lesson);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lessons' })
  @ApiResponse({
    status: 200,
    description: 'List of lessons',
    type: PaginatedResponseDto,
  })
  async findAll(
    @Query() query: ListLessonQueryDto,
  ): Promise<PaginatedResponseDto<LessonResponseDto>> {
    const result = await this.lessonService.findAll(query);
    return {
      ...result,
      items: result.items.map((lesson) => new LessonResponseDto(lesson)),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lesson by id' })
  @ApiResponse({
    status: 200,
    description: 'Lesson found',
    type: LessonResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<LessonResponseDto> {
    const lesson = await this.lessonService.findOne(id);
    return new LessonResponseDto(lesson);
  }

  @Patch(':id')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a lesson' })
  @ApiResponse({
    status: 200,
    description: 'Lesson updated successfully',
    type: LessonResponseDto,
  })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<LessonResponseDto> {
    const lesson = await this.lessonService.update(
      id,
      req.user.id,
      updateLessonDto,
    );
    return new LessonResponseDto(lesson);
  }

  @Delete(':id')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a lesson' })
  @ApiResponse({ status: 204, description: 'Lesson deleted successfully' })
  async remove(@Request() req, @Param('id') id: string): Promise<void> {
    await this.lessonService.remove(id, req.user.id);
  }

  @Post(':id/publish')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Publish a lesson' })
  @ApiResponse({
    status: 200,
    description: 'Lesson published successfully',
    type: LessonResponseDto,
  })
  async publish(
    @Request() req,
    @Param('id') id: string,
  ): Promise<LessonResponseDto> {
    const lesson = await this.lessonService.publish(id, req.user.id);
    return new LessonResponseDto(lesson);
  }
}
