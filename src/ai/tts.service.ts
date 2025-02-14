import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ElevenLabsClient } from 'elevenlabs';

import { UploadService } from 'src/common/upload/upload.service';
import {
  TextToSpeechDto,
  TextToSpeechResponseDto,
} from 'src/ai/dto/text-to-speech.dto';
import { Readable } from 'stream';

@Injectable()
export class TtsService {
  private client: ElevenLabsClient;
  private readonly outputDir = 'public/audio';

  constructor(
    private configService: ConfigService,
    private uploadSerivce: UploadService,
  ) {
    const apiKey = this.configService.get<string>('ELEVEN_LABS_API_KEY');
    if (!apiKey) throw new Error('Missing ElevenLabs API key');

    this.client = new ElevenLabsClient({
      apiKey: apiKey,
    });
  }

  async textToSpeech(dto: TextToSpeechDto): Promise<TextToSpeechResponseDto> {
    try {
      console.log('Converting text to speech:', JSON.stringify(dto, null, 2));
      let audioUrl = '';
      if (!dto.voiceId) {
        throw new Error('Voice ID is required');
      }
      const audioStream = await this.client.textToSpeech.convert(dto.voiceId, {
        voice_settings: dto.voiceSettings,
        text: dto.text,
      });

      // // Save audio local file
      // const filename = `speech-${Date.now()}.mp3`;
      // const filepath = path.join(this.outputDir, filename);
      // const writeStream = fs.createWriteStream(filepath);
      // await new Promise((resolve, reject) => {
      //   audioStream.pipe(writeStream).on('finish', resolve).on('error', reject);
      // });
      // audioUrl = `/audio/${filename}`;

      // Convert stream to buffer
      const chunks: Buffer[] = [];
      for await (const chunk of audioStream) {
        chunks.push(Buffer.from(chunk));
      }
      const audioBuffer = Buffer.concat(chunks);

      // Create file object for uploadthing
      const file: Express.Multer.File = {
        buffer: audioBuffer,
        originalname: `speech-${Date.now()}.mp3`,
        mimetype: 'audio/mpeg',
        fieldname: 'audio',
        encoding: '7bit',
        size: audioBuffer.length,
        stream: Readable.from(audioBuffer),
        destination: '',
        filename: '',
        path: '',
      };
      const uploadResult = await this.uploadSerivce.uploadFile(file);
      if (!uploadResult.data) {
        throw new Error('Upload failed - no data returned');
      }
      audioUrl = uploadResult.data.url;

      return {
        audioUrl: audioUrl,
        text: dto.text,
        voiceId: dto.voiceId,
      };
    } catch (error) {
      console.error('Error during text-to-speech conversion:', error);
      throw error;
    }
  }

  async getAll(): Promise<any> {
    try {
      const voices = await this.client.voices.getAll();
      console.log('Auth successful, available voices:', voices);
      return voices;
    } catch (error) {
      console.error('Auth test failed:', error);
      throw error;
    }
  }

  async test() {
    const testDto: TextToSpeechDto = {
      text: 'Hi',
      voiceId: 'nPczCjzI2devNBz1zQrb',
      voiceSettings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0,
        use_speaker_boost: true,
      },
    };
    const result = await this.textToSpeech(testDto);
    return result;
  }
}
