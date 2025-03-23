import { Lesson as PrismaLesson } from '@prisma/client';

export enum SkillType {
  READING = 'READING',
  LISTENING = 'LISTENING',
  SPEAKING = 'SPEAKING',
  WRITING = 'WRITING',
}

export enum LevelType {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export interface ILesson extends PrismaLesson {}
