import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
import { PrismaService } from '../common/prisma/prisma.service';
import { serializeJSON } from '../common/utils/format';
import { SubmissionStatus } from '@prisma/client';
import { notDeletedQuery } from '../common/helper/prisma-queries.helper';

@Injectable()
export class AiService implements AiServiceInterface {
  private logger = new Logger(AiService.name);
  private groq: Groq;
  private readonly modelName = 'llama3-8b-8192';
  private readonly geminiModelName = 'gemini-1.5-flash';
  private geminiModel: any;
  private readonly CACHE_TTL = 30 * 60; // 30 minutes in seconds
  private readonly MAX_HISTORY_LENGTH = 10; // Maximum number of messages to keep in history
  private readonly MAX_MESSAGES = 50; // Maximum number of messages before forcing a new session

  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prisma: PrismaService,
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
${dto.followupExamples?.length ? '\nAsk follow-up questions like these one by one:\n' + dto.followupExamples.map((q) => `- ${q}`).join('\n') : ''}
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
      this.CACHE_TTL * 1000, // 30 minutes
    );
  }

  private async getSpeakingSessionData(
    sessionId: string,
  ): Promise<ChatSessionData | null> {
    // First try to get from cache
    const cachedData = await this.cacheManager.get<ChatSessionData>(
      `speaking:${sessionId}`,
    );

    if (cachedData) {
      return cachedData;
    }

    // If not in cache, try to get from database
    const submission = await this.prisma.lessonSubmission.findFirst({
      where: {
        id: sessionId,
        submissionType: 'speaking',
        status: SubmissionStatus.draft,
        ...notDeletedQuery,
      },
    });

    if (submission) {
      const content = submission.content as any;
      const sessionData: ChatSessionData = {
        systemPrompt: content.prompt || '',
        history: content.messages || [],
        lastActive: Date.now(),
        messageCount: (content.messages || []).length / 2,
        submissionId: sessionId,
      };

      // Store back in cache
      await this.updateSpeakingSessionData(sessionId, sessionData);
      this.logger.log('sessionData in db');
      this.logger.log(sessionData);
      return sessionData;
    }

    return null;
  }

  async checkSession(sessionId: string): Promise<CheckSessionResponseDto> {
    const sessionData = await this.cacheManager.get<ChatSessionData>(
      `chat:${sessionId}`,
    );
    return {
      status: !!sessionData,
      history: sessionData?.history || [],
      systemPrompt: sessionData?.systemPrompt,
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
      const prompt = `You are an expert language teacher evaluating an essay. You must provide explanations in Vietnamese language, while keeping English sentences as is.
      
Topic: ${topic}

Student's Essay:
---
${user_content}
---

${teacher_prompt ? `Additional Instructions and rules you must follow: ${teacher_prompt}\n` : ''}
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
      "sentence": "the problematic sentence in English",
      "error": "the specific error in English",
      "suggestion": "the suggested correction in English",
      "reason": "explanation of the error in Vietnamese (viết bằng tiếng Việt)",
      "position": "the position of the error in the sentence"
    }
  ],
  "overall_feedback": "comprehensive feedback in Vietnamese (viết nhận xét tổng thể bằng tiếng Việt)"
}

IMPORTANT NOTES:
- All explanations ("reason" and "overall_feedback") MUST be in Vietnamese
- Keep all sentences, errors, and corrections in English
- The response must be parseable JSON
- You must follow the additional instructions and rules provided by the teacher
- Do not include any text outside the JSON structure`;

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
                'You are an expert language teacher evaluating essays. You must respond with ONLY a valid JSON object in the specified format, with no additional text. Never include explanations outside the JSON structure. Your response must be parseable JSON. You must follow the additional instructions and rules provided by the teacher.',
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

      const systemPrompt = this.buildSpeakingSystemPrompt(dto);
      // Create a draft submission
      const draftSubmission = await this.prisma.lessonSubmission.create({
        data: {
          lessonId: dto.lessonId,
          userId: dto.userId,
          submissionType: 'speaking',
          status: SubmissionStatus.draft,
          content: serializeJSON({
            topic: dto.topicText,
            prompt: dto.promptText,
            messages: [],
          }),
          tokensUsed: 10,
        },
      });

      const sessionId = draftSubmission.id;
      const sessionData: ChatSessionData = {
        systemPrompt,
        history: [],
        lastActive: Date.now(),
        messageCount: 0,
        submissionId: sessionId,
      };

      await this.updateSpeakingSessionData(sessionId, sessionData);

      return {
        sessionId,
        topicText: dto.topicText,
        submissionId: draftSubmission.id,
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
      console.log('Starting recommendAnswer with sessionId:', dto.sessionId);

      if (!this.geminiModel) {
        throw new Error('Gemini model is not initialized.');
      }

      const sessionData = await this.getSpeakingSessionData(dto.sessionId);
      if (!sessionData) {
        throw new NotFoundException('Session not found or expired');
      }

      console.log('Retrieved session data:', {
        systemPrompt: sessionData.systemPrompt,
        historyLength: sessionData.history.length,
        messageCount: sessionData.messageCount,
      });

      // Get the last few messages for immediate context
      const recentMessages = sessionData.history.slice(-4);
      console.log('Recent messages:', recentMessages);

      const lastAssistantMessage =
        [...recentMessages].reverse().find((msg) => msg.role === 'assistant')
          ?.content || '';
      const lastUserMessage =
        [...recentMessages].reverse().find((msg) => msg.role === 'user')
          ?.content || '';

      console.log('Extracted context:', {
        lastAssistantMessage,
        lastUserMessage,
      });

      const chatConfig: any = {
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.9,
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

      console.log('Starting chat session with config:', {
        systemPrompt: sessionData.systemPrompt,
        historyLength: chatConfig.history.length,
      });

      const chatSession = this.geminiModel.startChat(chatConfig);

      const prompt = `As an AI language tutor, analyze the conversation history and help the student respond to the last message.

Current conversation context:
- Original topic/prompt: "${sessionData.systemPrompt}"
- Last AI message: "${lastAssistantMessage}"
- Last student message: "${lastUserMessage}"

Based on this specific conversation context, generate 3 different natural responses that the student could use to continue the conversation.

Requirements for responses:
1. Each response should directly relate to the last messages in the conversation
2. Vary in complexity and approach:
   - One should be simple and direct
   - One should be more detailed and elaborate
   - One should ask a follow-up question or introduce a related point
3. Must maintain conversation flow and topic relevance
4. Should help practice vocabulary and grammar naturally
5. Must be appropriate for the current discussion context

Return ONLY a JSON array with exactly 3 response strings. No additional text or formatting.`;

      console.log('Sending prompt to Gemini:', prompt);

      const result = await chatSession.sendMessage(prompt);
      console.log('Received result from Gemini');

      const response = await result.response;
      console.log('Processed Gemini response');

      const rawText = response.text();
      console.log('Raw response text:', rawText);

      // Xử lý chuỗi trả về: xóa ```json hoặc ``` nếu có
      const cleanedText = rawText
        .replace(/```json\n?/gi, '')
        .replace(/```/g, '')
        .trim();

      let parsed: string[];
      try {
        parsed = JSON.parse(cleanedText);
        console.log('Successfully parsed response:', parsed);
      } catch (err: any) {
        console.error('Failed to parse response:', err);
        throw new Error('Failed to parse JSON from Gemini output');
      }

      if (
        !Array.isArray(parsed) ||
        parsed.length !== 3 ||
        !parsed.every((item) => typeof item === 'string')
      ) {
        console.error('Invalid response format:', parsed);
        throw new Error('AI response is not a valid array of 3 strings');
      }

      return {
        suggestedResponses: parsed,
        sessionId: dto.sessionId,
      };
    } catch (error) {
      console.error('Error in recommendAnswer:', error);
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

    // Auto-save to draft submission
    this.logger.log('Auto-saving to draft submission');
    this.logger.log(sessionData.history);
    this.logger.log(sessionData.submissionId);

    if (sessionData.submissionId) {
      await this.prisma.lessonSubmission.update({
        where: { id: sessionData.submissionId },
        data: {
          content: serializeJSON({
            prompt: sessionData.systemPrompt,
            messages: sessionData.history,
          }),
        },
      });
    }
  }

  async checkSpeakingSession(
    sessionId: string,
  ): Promise<CheckSessionResponseDto> {
    const sessionData = await this.getSpeakingSessionData(sessionId);
    const data = {
      status: !!sessionData,
      history: sessionData?.history || [],
      systemPrompt: sessionData?.systemPrompt,
    };
    console.log(JSON.stringify(data, null, 2));
    return data;
  }

  async clearSpeakingSession(sessionId: string): Promise<{ message: string }> {
    await this.cacheManager.del(`speaking:${sessionId}`);
    return {
      message: 'Session cleared successfully',
    };
  }
}
