import { Lesson as PrismaLesson } from '@prisma/client';

export enum SkillType {
  READING = 'reading',
  LISTENING = 'listening',
  SPEAKING = 'speaking',
  WRITING = 'writing',
}

export enum LevelType {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export interface ILesson extends PrismaLesson {}
