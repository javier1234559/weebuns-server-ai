import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { CheckGrammarResponseDto } from './dto/check-grammar-response.dto';
import { CheckGrammarDto } from './dto/check-grammar.dto';
import {
  ChatMessageDto,
  ChatRequestDto,
  ChatResponseDto,
} from './dto/chat.dto';
import { RecommendTopicsResponseDto } from './dto/recommend-topics-response.dto';
import { RecommendTopicsDto } from './dto/recommend-topics.dto';
import { TranslateResponseDto } from './dto/translate-response.dto';
import { TranslateDto } from './dto/translate.dto';
import { EvaluateEssayDto } from './dto/evaluate-essay.dto';
import { EvaluateEssayResponseDto } from './dto/evaluate-essay-response.dto';
import { AiServiceInterface } from './interface/ai.service.interface';

@Injectable()
export class AiService implements AiServiceInterface {
  private groq: Groq;
  private readonly modelName = 'llama3-8b-8192';
  private readonly geminiModelName = 'gemini-1.5-flash';
  private geminiModel: any;

  // In-memory storage for chat sessions
  private chatSessions: Map<string, any> = new Map();

  constructor(private configService: ConfigService) {
    this.groq = new Groq({
      apiKey: this.configService.get<string>('AI_API_KEY'),
    });

    // Initialize Gemini
    const geminiApiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.warn('GEMINI_API_KEY is not set. Gemini features will not work.');
    } else {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      this.geminiModel = genAI.getGenerativeModel({
        model: this.geminiModelName,
      });
    }
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
        translated_text: completion.choices[0]?.message?.content?.trim() || '',
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
      if (!this.geminiModel) {
        throw new Error(
          'Gemini model is not initialized. Please check your GEMINI_API_KEY configuration.',
        );
      }

      const prompt = `Generate ${dto.count || 5} writing prompts as a JSON array. Format: ["prompt1", "prompt2", ...]`;

      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON array from the response
      const jsonMatch = text.match(/\[.*\]/s);
      const topics = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

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

  async chat(dto: ChatRequestDto): Promise<ChatResponseDto> {
    try {
      if (!this.geminiModel) {
        throw new Error(
          'Gemini model is not initialized. Please check your GEMINI_API_KEY configuration.',
        );
      }

      // Get or create chat session
      let sessionId = dto.sessionId || '';
      let chatSession;

      if (sessionId && this.chatSessions.has(sessionId)) {
        chatSession = this.chatSessions.get(sessionId);
      } else {
        sessionId = uuidv4();
        // Start a new chat session with system prompt if provided
        const chatConfig: any = {
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.7,
          },
        };

        // Add system prompt to history if provided
        if (dto.systemPrompt) {
          chatConfig.history = [
            {
              role: 'user',
              parts: [
                {
                  text: dto.systemPrompt,
                },
              ],
            },
          ];
        }

        chatSession = this.geminiModel.startChat(chatConfig);
        this.chatSessions.set(sessionId, chatSession);
      }

      // Send message and get response
      const result = await chatSession.sendMessage(dto.message);
      console.log('------');
      console.log(JSON.stringify(chatSession, null, 2));
      console.log(JSON.stringify(result, null, 2));
      const response = await result.response;
      let assistantMessage = response.text();

      // Try to parse the response as JSON
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(assistantMessage);
        // If successful, use the response field as the message
        if (parsedResponse && parsedResponse.response) {
          assistantMessage = parsedResponse.response;
        }
      } catch (error) {
        // If parsing fails, use the original message
        console.log(
          'Failed to parse response as JSON, using original message:',
          error.message,
        );
      }

      // Get chat history
      const history = await chatSession.getHistory();

      // Convert history to our format
      const formattedHistory: ChatMessageDto[] = history.map((msg: any) => ({
        role: msg.role,
        content: msg.parts[0].text,
      }));

      return {
        message: assistantMessage,
        sessionId,
        history: formattedHistory,
      };
    } catch (error) {
      throw new NotFoundException(`Chat failed: ${error.message}`);
    }
  }

  async evaluateEssay(
    dto: EvaluateEssayDto,
  ): Promise<EvaluateEssayResponseDto> {
    try {
      const { topic, user_content, teacher_prompt } = dto;

      // Construct the prompt for the AI
      const prompt = `You are an expert language teacher evaluating an essay. 
      
Topic: ${topic}

Student's Essay:
---
${user_content}
---

${teacher_prompt ? `Additional Instructions: ${teacher_prompt}\n` : ''}
---
IMPORTANT: You must respond with ONLY a valid JSON object in the following format, with no additional text before or after:

{
  "overall_score": (number between 0-100),
  "task_response": (number between 0-100),
  "coherence_cohesion": (number between 0-100),
  "lexical_resource": (number between 0-100),
  "grammar": (number between 0-100),
  "corrections": [
    {
      "id": "uuid",
      "sentence": "the problematic sentence",
      "error": "the specific error",
      "suggestion": "the suggested correction",
      "reason": "explanation of the error",
      "position": "the position of the error in the sentence"
    }
  ],
  "overall_feedback": "comprehensive feedback on the essay"
}

DO NOT include any explanatory text outside the JSON structure. The response must be parseable JSON.`;

      // Maximum retry attempts
      const maxRetries = 3;
      let attempts = 0;
      let parsedResponse: any = null;

      while (attempts < maxRetries) {
        attempts++;

        // Call the AI model with a more structured system message
        const completion = await this.groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content:
                'You are an expert language teacher evaluating essays. You must respond with ONLY a valid JSON object in the specified format, with no additional text. Never include explanations outside the JSON structure. Your response must be parseable JSON.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          model: this.modelName,
          temperature: 0.1, // Lower temperature for more deterministic responses
          max_tokens: 4000,
        });

        // Parse the response
        const responseContent = completion.choices[0]?.message?.content || '';

        // Extract the JSON part from the response
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.warn(
            `Attempt ${attempts}: Failed to extract JSON from response`,
          );
          continue;
        }

        try {
          parsedResponse = JSON.parse(jsonMatch[0]);

          // Validate the response structure
          if (
            typeof parsedResponse.overall_score !== 'number' ||
            typeof parsedResponse.task_response !== 'number' ||
            typeof parsedResponse.coherence_cohesion !== 'number' ||
            typeof parsedResponse.lexical_resource !== 'number' ||
            typeof parsedResponse.grammar !== 'number' ||
            !Array.isArray(parsedResponse.corrections) ||
            typeof parsedResponse.overall_feedback !== 'string'
          ) {
            console.warn(
              `Attempt ${attempts}: Response missing required fields`,
            );
            continue;
          }

          // If we get here, the response is valid
          break;
        } catch (error) {
          console.warn(
            `Attempt ${attempts}: Failed to parse JSON: ${error.message}`,
          );
          continue;
        }
      }

      // If all retries failed, return a default response
      if (!parsedResponse) {
        console.error('Failed to get a valid response after multiple attempts');
        return {
          overall_score: 0,
          task_response: 0,
          coherence_cohesion: 0,
          lexical_resource: 0,
          grammar: 0,
          corrections: [],
          overall_feedback: 'Unable to evaluate the essay. Please try again.',
        };
      }

      // Ensure corrections have UUIDs
      if (
        parsedResponse.corrections &&
        Array.isArray(parsedResponse.corrections)
      ) {
        parsedResponse.corrections = parsedResponse.corrections.map(
          (correction) => ({
            ...correction,
            id: correction.id || uuidv4(),
          }),
        );
      }

      return parsedResponse as EvaluateEssayResponseDto;
    } catch (error) {
      console.error('Error evaluating essay:', error);
      throw error;
    }
  }
}
