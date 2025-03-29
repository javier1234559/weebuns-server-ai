import { Prisma } from '@prisma/client';

export type UserWithProfiles = Prisma.UserGetPayload<{
  include: {
    teacherProfile: true;
    studentProfile: true;
  };
}>;
