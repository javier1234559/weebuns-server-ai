import { CheckGrammarResponseDto } from 'src/ai/dto/check-grammar-response.dto';
import { CheckGrammarDto } from 'src/ai/dto/check-grammar.dto';
import { ChatRequestDto, ChatResponseDto } from 'src/ai/dto/chat.dto';
import { RecommendTopicsResponseDto } from 'src/ai/dto/recommend-topics-response.dto';
import { RecommendTopicsDto } from 'src/ai/dto/recommend-topics.dto';
import { TranslateResponseDto } from 'src/ai/dto/translate-response.dto';
import { TranslateDto } from 'src/ai/dto/translate.dto';
import { EvaluateEssayDto } from '../dto/evaluate-essay.dto';
import { EvaluateEssayResponseDto } from '../dto/evaluate-essay-response.dto';

export interface AiServiceInterface {
  checkGrammar(payload: CheckGrammarDto): Promise<CheckGrammarResponseDto>;
  recommendTopics(
    payload: RecommendTopicsDto,
  ): Promise<RecommendTopicsResponseDto>;
  translate(payload: TranslateDto): Promise<TranslateResponseDto>;
  chat(payload: ChatRequestDto): Promise<ChatResponseDto>;

  evaluateEssay(payload: EvaluateEssayDto): Promise<EvaluateEssayResponseDto>;
}
