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
import {
  CreateVocabularyDto,
  UpdateVocabularyDto,
  FindAllVocabularyQuery,
  UpdateVocabularyReviewDto,
} from './dto/vocabulary-request.dto';
import {
  VocabularyResponseDto,
  VocabulariesResponse,
  DeleteVocabularyResponse,
} from './dto/vocabulary-response.dto';
import { VocabularyService } from './vocabulary.service';

@ApiTags('vocabularies')
@Controller('vocabularies')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Post()
  @Roles(UserRole.USER, UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new vocabulary' })
  @ApiResponse({ status: 201, type: VocabularyResponseDto })
  create(@Body() createVocabularyDto: CreateVocabularyDto, @Req() req) {
    return this.vocabularyService.create(createVocabularyDto, req.user);
  }

  @Get()
  @Roles(UserRole.USER, UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all vocabularies with pagination' })
  @ApiResponse({ status: 200, type: VocabulariesResponse })
  findAll(@Query() query: FindAllVocabularyQuery, @Req() req) {
    return this.vocabularyService.findAll(query, req.user);
  }

  @Get('due')
  @Roles(UserRole.USER, UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all vocabularies due for review' })
  @ApiResponse({ status: 200, type: VocabulariesResponse })
  getDueVocabularies(@Req() req) {
    return this.vocabularyService.getDueVocabularies(req.user);
  }

  @Get(':id')
  @Roles(UserRole.USER, UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a vocabulary by id' })
  @ApiResponse({ status: 200, type: VocabularyResponseDto })
  findOne(@Param('id') id: string, @Req() req) {
    return this.vocabularyService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(UserRole.USER, UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a vocabulary' })
  @ApiResponse({ status: 200, type: VocabularyResponseDto })
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
  @ApiResponse({ status: 200, type: VocabularyResponseDto })
  updateReviewStatus(
    @Param('id') id: string,
    @Body() dto: UpdateVocabularyReviewDto,
    @Req() req,
  ) {
    return this.vocabularyService.updateReviewStatus(id, dto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.USER, UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a vocabulary' })
  @ApiResponse({ status: 200, type: DeleteVocabularyResponse })
  remove(@Param('id') id: string, @Req() req) {
    return this.vocabularyService.remove(id, req.user);
  }
}
