import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UTApi } from 'uploadthing/server';
import { UploadFileResult } from 'uploadthing/types';

@Injectable()
export class UploadService {
  private utapi: UTApi;

  constructor(private configService: ConfigService) {
    this.utapi = new UTApi({
      token: this.configService.get('UPLOADTHING_TOKEN'),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadFileResult> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }
      const fileObject = new File([file.buffer], file.originalname, {
        type: file.mimetype,
      });
      const uploadResponse: UploadFileResult =
        await this.utapi.uploadFiles(fileObject);
      console.log('Upload response:', JSON.stringify(uploadResponse, null, 2));
      return uploadResponse;
    } catch (error) {
      console.error('Upload error:', error);
      throw new BadRequestException('Failed to upload file');
    }
  }

  async uploadMany(files: Express.Multer.File[]): Promise<UploadFileResult[]> {
    try {
      if (!files?.length) {
        throw new BadRequestException('No files provided');
      }

      // Process files one by one to ensure proper upload
      const uploadPromises = files.map(async (file) => {
        const fileObject = new File([file.buffer], file.originalname, {
          type: file.mimetype,
        });

        return this.utapi.uploadFiles(fileObject) as Promise<UploadFileResult>;
      });

      const uploadResponses = await Promise.all(uploadPromises);

      console.log(
        'Upload responses:',
        JSON.stringify(uploadResponses, null, 2),
      );
      return uploadResponses;
    } catch (error) {
      console.error('Upload error:', error);
      throw new BadRequestException(error.message || 'Failed to upload files');
    }
  }

  async deleteFile(fileKey: string) {
    try {
      await this.utapi.deleteFiles(fileKey);
      return {
        success: true,
        message: 'File deleted successfully',
      };
    } catch (error) {
      console.error('Delete error:', error);
      throw new BadRequestException('Failed to delete file');
    }
  }
}
