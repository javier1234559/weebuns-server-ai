import {
  User as PrismaUser,
  StudentProfile,
  TeacherProfile,
} from '@prisma/client';

export interface IUser extends PrismaUser {}

export interface IStudentProfile extends StudentProfile {}

export interface ITeacherProfile extends TeacherProfile {}
