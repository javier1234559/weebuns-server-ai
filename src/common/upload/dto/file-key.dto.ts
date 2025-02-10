import { IsNotEmpty, IsString } from 'class-validator';

export class FileKeyDto {
  @IsNotEmpty()
  @IsString()
  key: string;
}
