import { CheckGrammarResponseDto } from 'src/ai/dto/check-grammar-response.dto';
import { CheckGrammarDto } from 'src/ai/dto/check-grammar.dto';
import { ChatRequestDto, ChatResponseDto } from 'src/ai/dto/chat.dto';
import { RecommendTopicsResponseDto } from 'src/ai/dto/recommend-topics-response.dto';
import { RecommendTopicsDto } from 'src/ai/dto/recommend-topics.dto';
import { TranslateResponseDto } from 'src/ai/dto/translate-response.dto';
import { TranslateDto } from 'src/ai/dto/translate.dto';
import { EvaluateEssayDto } from '../dto/evaluate-essay.dto';
import { EvaluateEssayResponseDto } from '../dto/evaluate-essay-response.dto';
import {
  RecommendAnswerDto,
  SpeakingDto,
  StartSpeakingDto,
} from '../dto/ai-request';
import {
  CheckSessionResponseDto,
  RecommendAnswerResponseDto,
  StartSpeakingResponseDto,
} from 'src/ai/dto/ai-response';

export interface AiServiceInterface {
  checkSession(sessionId: string): Promise<CheckSessionResponseDto>;

  //old
  checkGrammar(payload: CheckGrammarDto): Promise<CheckGrammarResponseDto>;
  recommendTopics(
    payload: RecommendTopicsDto,
  ): Promise<RecommendTopicsResponseDto>;
  translate(payload: TranslateDto): Promise<TranslateResponseDto>;

  // writing
  chat(payload: ChatRequestDto): Promise<ChatResponseDto>;
  chatStreaming(payload: ChatRequestDto): AsyncGenerator<string>;
  evaluateEssay(payload: EvaluateEssayDto): Promise<EvaluateEssayResponseDto>;

  //speaking
  startSpeaking(payload: StartSpeakingDto): Promise<StartSpeakingResponseDto>;
  chatSpeaking(payload: SpeakingDto): Promise<ChatResponseDto>;
  chatSpeakingStreaming(payload: SpeakingDto): AsyncGenerator<string>;
  recommendAnswer(
    payload: RecommendAnswerDto,
  ): Promise<RecommendAnswerResponseDto>;
  checkSpeakingSession(sessionId: string): Promise<CheckSessionResponseDto>;
  clearSpeakingSession(sessionId: string): Promise<{ message: string }>;
}
