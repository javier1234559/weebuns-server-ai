import { Prisma } from '@prisma/client';

export function serializeJSON<T>(data: T): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(data)) as Prisma.InputJsonValue;
}

export function deserializeJSON<T>(data: Prisma.JsonValue): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

export function formatNumberPrecision(
  value: number,
  precision: number = 2,
): number {
  return Number(value.toFixed(precision));
}
