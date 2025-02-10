import { ApiProperty } from '@nestjs/swagger';

export class RecommendTopicsResponseDto {
  @ApiProperty({ type: [String] })
  topics: string[];

  @ApiProperty()
  category: string;

  @ApiProperty()
  count: number;
}
