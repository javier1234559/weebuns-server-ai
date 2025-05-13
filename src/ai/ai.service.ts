import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
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
import {
  RecommendAnswerDto,
  SpeakingDto,
  StartSpeakingDto,
} from './dto/ai-request';
import {
  StartSpeakingResponseDto,
  ChatSessionData,
  RecommendAnswerResponseDto,
  CheckSessionResponseDto,
} from './dto/ai-response';

@Injectable()
export class AiService implements AiServiceInterface {
  private groq: Groq;
  private readonly modelName = 'llama3-8b-8192';
  private readonly geminiModelName = 'gemini-2.0-flash';
  private geminiModel: any;
  private readonly CACHE_TTL = 30 * 60; // 30 minutes in seconds
  private readonly MAX_HISTORY_LENGTH = 10; // Maximum number of messages to keep in history
  private readonly MAX_MESSAGES = 50; // Maximum number of messages before forcing a new session

  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    // Initialize Groq
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

  private buildSpeakingSystemPrompt(dto: StartSpeakingDto): string {
    return `
${dto.promptText ? dto.promptText.trim() : ''}
${dto.topicText ? `\nTopic: "${dto.topicText.trim()}"` : ''}
${dto.followupExamples?.length ? '\nAsk follow-up questions like:\n' + dto.followupExamples.map((q) => `- ${q}`).join('\n') : ''}
${dto.backgroundKnowledge ? `\nBackground knowledge to consider: ${dto.backgroundKnowledge.trim()}` : ''}
`.trim();
  }

  private async updateSpeakingSessionData(
    sessionId: string,
    data: ChatSessionData,
  ): Promise<void> {
    await this.cacheManager.set(
      `speaking:${sessionId}`,
      data,
      this.CACHE_TTL * 1000,
    );
  }

  private async getSpeakingSessionData(
    sessionId: string,
  ): Promise<ChatSessionData | null> {
    return this.cacheManager.get<ChatSessionData>(`speaking:${sessionId}`);
  }

  async checkSession(sessionId: string): Promise<CheckSessionResponseDto> {
    const sessionData = await this.cacheManager.get<ChatSessionData>(
      `chat:${sessionId}`,
    );
    return {
      status: !!sessionData,
    };
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
        throw new Error('Gemini model is not initialized.');
      }

      let sessionId = dto.sessionId || '';
      let chatSession;

      if (sessionId) {
        const sessionData = await this.cacheManager.get<ChatSessionData>(
          `chat:${sessionId}`,
        );
        if (sessionData) {
          const chatConfig: any = {
            generationConfig: {
              maxOutputTokens: 2048,
              temperature: 0.7,
            },
            history: sessionData.history.map((msg) => ({
              role: msg.role,
              parts: [{ text: msg.content }],
            })),
          };
          chatSession = this.geminiModel.startChat(chatConfig);
        }
      }

      if (!chatSession) {
        sessionId = uuidv4();
        const chatConfig: any = {
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.7,
          },
        };

        if (dto.systemPrompt) {
          chatConfig.history = [
            {
              role: 'user',
              parts: [{ text: dto.systemPrompt }],
            },
          ];
        }

        chatSession = this.geminiModel.startChat(chatConfig);
      }

      const result = await chatSession.sendMessage(dto.message);
      const response = await result.response;
      const assistantMessage = response.text();

      // Store history with our internal format (using 'assistant' role)
      const history = await chatSession.getHistory();
      const formattedHistory: ChatMessageDto[] = history.map((msg: any) => ({
        role: msg.role,
        content: msg.parts[0].text,
      }));

      // Store session in cache
      const sessionData: ChatSessionData = {
        systemPrompt: dto.systemPrompt || '',
        history: formattedHistory,
        lastActive: Date.now(),
        messageCount: formattedHistory.length / 2,
      };
      await this.cacheManager.set(
        `chat:${sessionId}`,
        sessionData,
        this.CACHE_TTL * 1000,
      );

      return {
        message: assistantMessage,
        sessionId,
        history: formattedHistory,
      };
    } catch (error) {
      throw new NotFoundException(`Chat failed: ${error.message}`);
    }
  }

  async *chatStreaming(dto: ChatRequestDto): AsyncGenerator<string> {
    if (!this.geminiModel) {
      throw new Error('Gemini model is not initialized.');
    }

    let sessionId = dto.sessionId || '';
    let chatSession;

    if (sessionId) {
      const sessionData = await this.cacheManager.get<ChatSessionData>(
        `chat:${sessionId}`,
      );
      if (sessionData) {
        const chatConfig: any = {
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.7,
          },
          history: sessionData.history.map((msg) => ({
            role: msg.role,
            parts: [{ text: msg.content }],
          })),
        };
        chatSession = this.geminiModel.startChat(chatConfig);
      }
    }

    if (!chatSession) {
      sessionId = uuidv4();
      const chatConfig: any = {
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
        },
      };

      if (dto.systemPrompt) {
        chatConfig.history = [
          {
            role: 'user',
            parts: [{ text: dto.systemPrompt }],
          },
        ];
      }

      chatSession = this.geminiModel.startChat(chatConfig);
    }

    const result = await chatSession.sendMessage(dto.message);
    const response = await result.response;
    const assistantMessage = response.text();

    // Split assistantMessage into chunks (e.g., 100 characters each)
    const chunks = assistantMessage.match(/.{1,100}/g) || [];
    for (const chunk of chunks) {
      yield chunk;
    }

    // Store history with our internal format (using 'assistant' role)
    const history = await chatSession.getHistory();
    const formattedHistory: ChatMessageDto[] = history.map((msg: any) => ({
      role: msg.role,
      content: msg.parts[0].text,
    }));

    // Store session in cache
    const sessionData: ChatSessionData = {
      systemPrompt: dto.systemPrompt || '',
      history: formattedHistory,
      lastActive: Date.now(),
      messageCount: formattedHistory.length / 2,
    };
    await this.cacheManager.set(
      `chat:${sessionId}`,
      sessionData,
      this.CACHE_TTL * 1000,
    );
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

  async startSpeaking(
    dto: StartSpeakingDto,
  ): Promise<StartSpeakingResponseDto> {
    try {
      if (!this.geminiModel) {
        throw new Error('Gemini model is not initialized.');
      }

      const sessionId = uuidv4();
      const systemPrompt = this.buildSpeakingSystemPrompt(dto);
      const sessionData: ChatSessionData = {
        systemPrompt,
        history: [],
        lastActive: Date.now(),
        messageCount: 0,
      };

      await this.updateSpeakingSessionData(sessionId, sessionData);

      return {
        sessionId,
        topicText: dto.topicText,
      };
    } catch (error) {
      throw new NotFoundException(
        `Failed to start speaking session: ${error.message}`,
      );
    }
  }

  async chatSpeaking(dto: SpeakingDto): Promise<ChatResponseDto> {
    try {
      if (!this.geminiModel) {
        throw new Error('Gemini model is not initialized.');
      }

      // Get session data from cache
      const sessionData = await this.getSpeakingSessionData(dto.sessionId);
      if (!sessionData) {
        throw new NotFoundException('Session not found or expired');
      }

      // Check if we need to force a new session
      if (sessionData.messageCount >= this.MAX_MESSAGES) {
        throw new NotFoundException(
          'Session has reached maximum message limit. Please start a new session.',
        );
      }

      // Create chat config with system prompt and recent history
      const chatConfig: any = {
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
        },
        history: [
          {
            role: 'user',
            parts: [{ text: sessionData.systemPrompt }],
          },
          // Add recent history (last N messages) with role conversion
          ...sessionData.history.slice(-this.MAX_HISTORY_LENGTH).map((msg) => ({
            role: msg.role === 'assistant' ? 'model' : msg.role,
            parts: [{ text: msg.content }],
          })),
        ],
      };

      const chatSession = this.geminiModel.startChat(chatConfig);
      const result = await chatSession.sendMessage(dto.message);
      const response = await result.response;
      const assistantMessage = response.text();

      // Store history with our internal format (using 'assistant' role)
      sessionData.history.push(
        { role: 'user', content: dto.message },
        { role: 'assistant', content: assistantMessage },
      );
      sessionData.lastActive = Date.now();
      sessionData.messageCount += 1;

      // Keep only recent history
      if (sessionData.history.length > this.MAX_HISTORY_LENGTH * 2) {
        sessionData.history = sessionData.history.slice(
          -this.MAX_HISTORY_LENGTH * 2,
        );
      }

      await this.updateSpeakingSessionData(dto.sessionId, sessionData);

      return {
        message: assistantMessage,
        sessionId: dto.sessionId,
        history: sessionData.history,
      };
    } catch (error) {
      throw new NotFoundException(`Chat failed: ${error.message}`);
    }
  }

  async recommendAnswer(
    dto: RecommendAnswerDto,
  ): Promise<RecommendAnswerResponseDto> {
    try {
      console.log(dto);

      if (!this.geminiModel) {
        throw new Error('Gemini model is not initialized.');
      }

      const sessionData = await this.getSpeakingSessionData(dto.sessionId);
      if (!sessionData) {
        throw new NotFoundException('Session not found or expired');
      }

      const chatConfig: any = {
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
        },
        history: [
          {
            role: 'user',
            parts: [{ text: sessionData.systemPrompt }],
          },
          ...sessionData.history.slice(-this.MAX_HISTORY_LENGTH).map((msg) => ({
            role: msg.role === 'assistant' ? 'model' : msg.role,
            parts: [{ text: msg.content }],
          })),
        ],
      };

      const chatSession = this.geminiModel.startChat(chatConfig);

      const prompt = `You are a JSON API recommend answer for user. Return ONLY a JSON array with exactly 3 strings. No markdown, no code blocks, no additional text.
  Example: ["response1", "response2", "response3"]`;

      const result = await chatSession.sendMessage(prompt);
      const response = await result.response;

      const rawText = response.text();

      // Xử lý chuỗi trả về: xóa ```json hoặc ``` nếu có
      const cleanedText = rawText
        .replace(/```json\n?/gi, '')
        .replace(/```/g, '')
        .trim();

      let parsed: string[];
      try {
        parsed = JSON.parse(cleanedText);
      } catch (err: any) {
        console.log(err);
        throw new Error('Failed to parse JSON from Gemini output');
      }

      if (
        !Array.isArray(parsed) ||
        parsed.length !== 3 ||
        !parsed.every((item) => typeof item === 'string')
      ) {
        throw new Error('AI response is not a valid array of 3 strings');
      }

      return {
        suggestedResponses: parsed,
        sessionId: dto.sessionId,
      };
    } catch (error) {
      throw new NotFoundException(
        `Failed to recommend answers: ${error.message}`,
      );
    }
  }

  async *chatSpeakingStreaming(dto: SpeakingDto): AsyncGenerator<string> {
    if (!this.geminiModel) {
      throw new Error('Gemini model is not initialized.');
    }

    // Lấy session data như cũ
    const sessionData = await this.getSpeakingSessionData(dto.sessionId);
    if (!sessionData) {
      throw new NotFoundException('Session not found or expired');
    }
    if (sessionData.messageCount >= this.MAX_MESSAGES) {
      throw new NotFoundException(
        'Session has reached maximum message limit. Please start a new session.',
      );
    }

    // Tạo chat config như cũ
    const chatConfig: any = {
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
      history: [
        {
          role: 'user',
          parts: [{ text: sessionData.systemPrompt }],
        },
        ...sessionData.history.slice(-this.MAX_HISTORY_LENGTH).map((msg) => ({
          role: msg.role === 'assistant' ? 'model' : msg.role,
          parts: [{ text: msg.content }],
        })),
      ],
    };

    const chatSession = this.geminiModel.startChat(chatConfig);
    const result = await chatSession.sendMessage(dto.message);
    const response = await result.response;
    const assistantMessage = response.text();
    console.log('Test:', assistantMessage);

    // Chia nhỏ assistantMessage thành các chunk (ví dụ 100 ký tự)
    const chunks = assistantMessage.match(/.{1,100}/g) || [];
    for (const chunk of chunks) {
      yield chunk;
    }

    // Cập nhật session như cũ
    sessionData.history.push(
      { role: 'user', content: dto.message },
      { role: 'assistant', content: assistantMessage },
    );
    sessionData.lastActive = Date.now();
    sessionData.messageCount += 1;
    if (sessionData.history.length > this.MAX_HISTORY_LENGTH * 2) {
      sessionData.history = sessionData.history.slice(
        -this.MAX_HISTORY_LENGTH * 2,
      );
    }
    await this.updateSpeakingSessionData(dto.sessionId, sessionData);
  }
}
