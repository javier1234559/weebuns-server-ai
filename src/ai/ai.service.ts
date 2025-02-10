import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Groq from 'groq-sdk';

import { CheckGrammarResponseDto } from './dto/check-grammar-response.dto';
import { CheckGrammarDto } from './dto/check-grammar.dto';
import { RecommendTopicsResponseDto } from './dto/recommend-topics-response.dto';
import { RecommendTopicsDto } from './dto/recommend-topics.dto';
import { TranslateResponseDto } from './dto/translate-response.dto';
import { TranslateDto } from './dto/translate.dto';
import { AiServiceInterface } from './interface/ai.service.interface';

@Injectable()
export class AiService implements AiServiceInterface {
  private groq: Groq;
  private readonly modelName = 'llama3-8b-8192';

  constructor(private configService: ConfigService) {
    this.groq = new Groq({
      apiKey: this.configService.get<string>('AI_API_KEY'),
    });
  }

  async translate(dto: TranslateDto): Promise<TranslateResponseDto> {
    try {
      const prompt = `${dto.text}\n\nTranslate from ${dto.sourceLanguage} to ${dto.targetLanguage}.`;

      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Translate directly, no comments.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: this.modelName,
        temperature: 0.3,
      });

      console.log('------');
      console.log(prompt);
      console.log(JSON.stringify(completion, null, 2));
      return {
        original_text: dto.text,
        translated_text: completion.choices[0]?.message?.content?.trim(),
        source_language: dto.sourceLanguage,
        target_language: dto.targetLanguage,
      };
    } catch (error) {
      throw new NotFoundException(`Translation failed: ${error.message}`);
    }
  }

  async checkGrammar(dto: CheckGrammarDto): Promise<CheckGrammarResponseDto> {
    try {
      const prompt = `Check this text and return ONLY JSON: ${dto.text}

Required format:
{
  "corrections": [
    {
      "original": "error text",
      "corrected": "fixed text",
      "explanation": "why",
      "type": "grammar|spelling|punctuation",
      "position": {"start":0, "end":0}
    }
  ],
  "summary": "brief summary",
  "overall_score": 100
}`;

      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'You are a grammar checker. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: this.modelName,
        temperature: 0.1,
      });

      console.log('------');
      console.log(prompt);
      console.log(JSON.stringify(completion, null, 2));
      const response = completion.choices[0]?.message?.content;
      return JSON.parse(response || '{}');
    } catch (error) {
      throw new NotFoundException(`Grammar check failed: ${error.message}`);
    }
  }

  async recommendTopics(
    dto: RecommendTopicsDto,
  ): Promise<RecommendTopicsResponseDto> {
    try {
      const prompt = `Only ${dto.count || 5} writing prompts`;
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Return JSON array only: ["prompt1"]',
          },
          {
            role: 'user',
            content: '3 writing prompts',
          },
          {
            role: 'assistant',
            content:
              '["Tell me about your best day", "Write about a dream", "Describe your favorite place"]',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: this.modelName,
        temperature: 0.8,
      });

      console.log('------');
      console.log(prompt);
      console.log(JSON.stringify(completion, null, 2));
      const topics = JSON.parse(
        completion.choices[0]?.message?.content || '[]',
      );
      return {
        topics,
        category: dto.category || 'general',
        count: topics.length,
      };
    } catch (error) {
      throw new NotFoundException(
        `Topic recommendation failed: ${error.message}`,
      );
    }
  }
}
