import { SetMetadata } from '@nestjs/common/decorators';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  TEACHER = 'teacher',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
