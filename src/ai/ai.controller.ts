import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
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
import { SpeakingDto, StartSpeakingDto } from 'src/ai/dto/ai-request';
import {
  CheckSessionResponseDto,
  RecommendAnswerResponseDto,
  StartSpeakingResponseDto,
} from 'src/ai/dto/ai-response';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('ai')
@ApiTags('ai')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(CacheInterceptor)
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly ttsService: TtsService,
  ) {}

  @Post('check-session/:sessionId')
  @Roles(UserRole.USER)
  @ApiResponse({
    status: HttpStatus.OK,
    type: CheckSessionResponseDto,
    description: 'Session checked successfully',
  })
  async checkSession(
    @Param('sessionId') sessionId: string,
  ): Promise<CheckSessionResponseDto> {
    return this.aiService.checkSession(sessionId);
  }

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
  @Roles(UserRole.USER)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ChatResponseDto,
    description: 'Chat response generated successfully',
  })
  async chat(@Body() dto: ChatRequestDto): Promise<ChatResponseDto> {
    return this.aiService.chat(dto);
  }

  @Public()
  @Post('chat-streaming')
  @ApiOperation({ summary: 'Stream chat response' })
  @ApiResponse({
    type: String,
    status: HttpStatus.OK,
    description: 'Streaming response from AI chat',
  })
  async chatStreaming(@Body() dto: ChatRequestDto, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      for await (const chunk of this.aiService.chatStreaming(dto)) {
        res.write(`data: ${chunk}\n\n`);
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (err) {
      res.write(`data: [ERROR] ${err.message}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  }

  @Post('speaking/start')
  @Roles(UserRole.USER)
  @ApiResponse({
    status: HttpStatus.OK,
    type: StartSpeakingResponseDto,
    description: 'Chat response generated successfully',
  })
  async startSpeaking(
    @Body() dto: StartSpeakingDto,
  ): Promise<StartSpeakingResponseDto> {
    return this.aiService.startSpeaking(dto);
  }

  @Post('speaking/chat')
  @Roles(UserRole.USER)
  @ApiBody({ type: SpeakingDto })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ChatResponseDto,
    description: 'Chat response generated successfully',
  })
  async chatSpeaking(@Body() dto: SpeakingDto): Promise<ChatResponseDto> {
    return this.aiService.chatSpeaking(dto);
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

  @Public()
  @Get('speaking/recommend-answer/:sessionId')
  @Roles(UserRole.USER)
  @ApiResponse({
    status: HttpStatus.OK,
    type: RecommendAnswerResponseDto,
    description: 'Recommend answer successful',
  })
  async recommendAnswer(
    @Param('sessionId') sessionId: string,
  ): Promise<RecommendAnswerResponseDto> {
    return this.aiService.recommendAnswer({ sessionId });
  }

  @Public()
  @Post('speaking/chat-streaming')
  @ApiOperation({ summary: 'Stream chat speaking response' })
  @ApiResponse({
    type: String,
    status: HttpStatus.OK,
    description: 'Streaming response from AI chat speaking',
  })
  async chatSpeakingStreaming(@Body() dto: SpeakingDto, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    console.log(JSON.stringify(dto, null, 2));
    try {
      for await (const chunk of this.aiService.chatSpeakingStreaming(dto)) {
        console.log(chunk);
        res.write(`data: ${chunk}\n\n`);
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (err) {
      res.write(`data: [ERROR] ${err.message}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  }
}
