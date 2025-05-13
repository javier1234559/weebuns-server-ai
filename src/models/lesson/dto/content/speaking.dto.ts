import { ApiProperty } from '@nestjs/swagger';

export class ContentSpeakingDTO {
  @ApiProperty({
    description: 'The main topic text for the speaking lesson',
    example: 'Travel and Tourism',
  })
  topicText: string;

  @ApiProperty({
    description: 'The prompt text to guide the speaking practice',
    example: "Let's practice speaking English",
  })
  promptText: string;

  @ApiProperty({
    description: 'Example follow-up questions for the speaking practice',
    example: [
      'What places have you visited?',
      'How was your last trip?',
      'Do you prefer traveling alone or with friends?',
      'What country would you like to visit next and why?',
    ],
    type: [String],
  })
  followupExamples: string[];

  @ApiProperty({
    description: 'Background knowledge and context for the speaking topic',
    example:
      "Focus on travel experiences, cultural differences, and common travel vocabulary such as 'hotel', 'sightseeing', 'itinerary', 'passport'.",
  })
  backgroundKnowledge: string;
}
