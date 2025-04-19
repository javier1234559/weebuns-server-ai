import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CacheKeyDto } from 'src/common/decorators/cache-key.decorator';
import { Roles, UserRole } from 'src/common/decorators/role.decorator';
import {
  TextToSpeechDto,
  TextToSpeechResponseDto,
} from 'src/ai/dto/text-to-speech.dto';
import { TtsService } from 'src/ai/tts.service';

import { AiService } from './ai.service';
import { CheckGrammarResponseDto } from './dto/check-grammar-response.dto';
import { CheckGrammarDto } from './dto/check-grammar.dto';
import { ChatRequestDto, ChatResponseDto } from './dto/chat.dto';
import { RecommendTopicsResponseDto } from './dto/recommend-topics-response.dto';
import { RecommendTopicsDto } from './dto/recommend-topics.dto';
import { TranslateResponseDto } from './dto/translate-response.dto';
import { TranslateDto } from './dto/translate.dto';
import { EvaluateEssayResponseDto } from 'src/ai/dto/evaluate-essay-response.dto';
import { EvaluateEssayDto } from 'src/ai/dto/evaluate-essay.dto';
import { RolesGuard } from 'src/common/auth/role.guard';
import { AuthGuard } from 'src/common/auth/auth.guard';

@Controller('ai')
@ApiTags('ai')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(CacheInterceptor)
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly ttsService: TtsService,
  ) {}

  @Post('translate')
  @Roles(UserRole.USER)
  @ApiBody({ type: TranslateDto })
  @CacheKeyDto('translate', 86400)
  @ApiResponse({
    status: HttpStatus.OK,
    type: TranslateResponseDto,
    description: 'Translation successful',
  })
  async translate(@Body() dto: TranslateDto): Promise<TranslateResponseDto> {
    return this.aiService.translate(dto);
  }

  @Post('check-grammar')
  @Roles(UserRole.USER)
  @ApiBody({ type: CheckGrammarDto })
  @CacheKeyDto('grammar', 86400)
  @ApiResponse({
    status: HttpStatus.OK,
    type: CheckGrammarResponseDto,
    description: 'Grammar check successful',
  })
  async checkGrammar(
    @Body() dto: CheckGrammarDto,
  ): Promise<CheckGrammarResponseDto> {
    return this.aiService.checkGrammar(dto);
  }

  @Get('recommend-topics')
  @Roles(UserRole.USER)
  @ApiResponse({
    status: HttpStatus.OK,
    type: RecommendTopicsResponseDto,
    description: 'Topics recommended successfully',
  })
  async recommendTopics(
    @Query() dto: RecommendTopicsDto,
  ): Promise<RecommendTopicsResponseDto> {
    return this.aiService.recommendTopics(dto);
  }

  @Get('tts/test')
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async textToSpeechTest(): Promise<any> {
    return this.ttsService.test();
  }

  @Post('tts/convert')
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    type: TextToSpeechResponseDto,
  })
  async textToSpeech(
    @Body() dto: TextToSpeechDto,
  ): Promise<TextToSpeechResponseDto> {
    return this.ttsService.textToSpeech(dto);
  }

  @Get('tts/all')
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async textToSpeechAll(): Promise<any> {
    return this.ttsService.getAll();
  }

  @Post('chat')
  // @Roles(UserRole.USER)
  @ApiBody({ type: ChatRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ChatResponseDto,
    description: 'Chat response generated successfully',
  })
  async chat(@Body() dto: ChatRequestDto): Promise<ChatResponseDto> {
    return this.aiService.chat(dto);
  }

  @Post('evaluate-essay')
  @Roles(UserRole.USER)
  @ApiBody({ type: EvaluateEssayDto })
  @ApiResponse({
    status: HttpStatus.OK,
    type: EvaluateEssayResponseDto,
  })
  async evaluateEssay(
    @Body() dto: EvaluateEssayDto,
  ): Promise<EvaluateEssayResponseDto> {
    return this.aiService.evaluateEssay(dto);
  }
}
