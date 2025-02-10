import {
  Controller,
  Delete,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UploadFileResult } from 'uploadthing/types';

import { DeleteResponseDto } from 'src/common/upload/dto/delete-response.dto';
import { FileKeyDto } from 'src/common/upload/dto/file-key.dto';

import { UploadService } from './upload.service';

@ApiTags('Upload')
@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    schema: {
      type: 'object',
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({
            fileType: /^(image|audio|application\/pdf)\/.+$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<UploadFileResult> {
    return this.uploadService.uploadFile(file);
  }

  @Post('many')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['files'],
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Files uploaded successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          url: { type: 'string' },
          name: { type: 'string' },
          size: { type: 'number' },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMany(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: /^(image|audio|application\/pdf)\/.+$/,
          }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ): Promise<UploadFileResult[]> {
    return this.uploadService.uploadMany(files);
  }

  @Post('video')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    schema: {
      type: 'object',
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100 * 1024 * 1024 }), // 100MB
          new FileTypeValidator({
            fileType: /^(image|audio|application\/pdf)\/.+$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<UploadFileResult> {
    return this.uploadService.uploadFile(file);
  }

  @Delete(':key')
  @ApiResponse({
    status: 200,
    type: DeleteResponseDto,
  })
  async deleteFile(@Param() params: FileKeyDto): Promise<DeleteResponseDto> {
    return this.uploadService.deleteFile(params.key);
  }
}
