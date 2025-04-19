import { Prisma } from '@prisma/client';

export function serializeJSON<T>(data: T): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(data)) as Prisma.InputJsonValue;
}

export function deserializeJSON<T>(data: Prisma.JsonValue): T {
  return JSON.parse(JSON.stringify(data)) as T;
}
