import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/auth/auth.guard';
import { RolesGuard } from 'src/common/auth/role.guard';
import { Roles, UserRole } from 'src/common/decorators/role.decorator';
import { PaginationInputDto } from 'src/common/dto/pagination.dto';
import { CreateVocabularyDto } from 'src/models/vocabulary/dto/create-vocabulary.dto';
import { UpdateVocabularyReviewDto } from 'src/models/vocabulary/dto/update-vocabulary-review.dto';
import { UpdateVocabularyDto } from 'src/models/vocabulary/dto/update-vocabulary.dto';
import { VocabularyFilterDto } from 'src/models/vocabulary/dto/vocabulary-filter.dto';
import { VocabularyResponseDto } from 'src/models/vocabulary/dto/vocabulary-response.dto';
import { VocabularyDto } from 'src/models/vocabulary/dto/vocabulary.dto';
import { VocabularyService } from 'src/models/vocabulary/vocabulary.service';

@ApiTags('vocabularies')
@Controller('vocabularies')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Post()
  @Roles(UserRole.USER, UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new vocabulary' })
  @ApiResponse({ status: 201, type: VocabularyDto })
  create(@Body() createVocabularyDto: CreateVocabularyDto, @Req() req) {
    return this.vocabularyService.create(createVocabularyDto, req.user);
  }

  @Get()
  @Roles(UserRole.USER, UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all vocabularies with pagination' })
  @ApiResponse({ status: 200, type: VocabularyResponseDto })
  findAll(
    @Query() paginationDto: PaginationInputDto,
    @Query() filterDto: VocabularyFilterDto,
    @Req() req,
  ) {
    return this.vocabularyService.findAll(paginationDto, req.user, filterDto);
  }

  @Get('due')
  @Roles(UserRole.USER, UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all vocabularies due for review' })
  @ApiResponse({ status: 200, type: [VocabularyDto] })
  getDueVocabularies(@Req() req) {
    return this.vocabularyService.getDueVocabularies(req.user);
  }

  @Get(':id')
  @Roles(UserRole.USER, UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a vocabulary by id' })
  @ApiResponse({ status: 200, type: VocabularyDto })
  findOne(@Param('id') id: string, @Req() req) {
    return this.vocabularyService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(UserRole.USER, UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a vocabulary' })
  @ApiResponse({ status: 200, type: VocabularyDto })
  update(
    @Param('id') id: string,
    @Body() updateVocabularyDto: UpdateVocabularyDto,
    @Req() req,
  ) {
    return this.vocabularyService.update(id, updateVocabularyDto, req.user);
  }

  @Patch(':id/review')
  @Roles(UserRole.USER, UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update vocabulary review status' })
  @ApiResponse({ status: 200, type: VocabularyDto })
  updateReviewStatus(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateVocabularyReviewDto,
    @Req() req,
  ) {
    return this.vocabularyService.updateReviewStatus(
      id,
      updateReviewDto.repetitionLevel,
      req.user,
    );
  }

  @Delete(':id')
  @Roles(UserRole.USER, UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a vocabulary' })
  @ApiResponse({ status: 200, type: VocabularyDto })
  remove(@Param('id') id: string, @Req() req) {
    return this.vocabularyService.remove(id, req.user);
  }
}
