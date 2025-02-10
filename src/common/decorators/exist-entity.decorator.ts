import { Injectable } from '@nestjs/common';

import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

import { PrismaService } from '../prisma/prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ExistEntityConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: string, args: any) {
    try {
      if (!value) return false;

      const [entityName] = args.constraints;
      const entity = (this.prisma as any)[entityName];

      if (!entity) return false;

      const record = await entity.findUnique({
        where: { id: value },
      });

      return !!record;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  }

  defaultMessage(args: any) {
    const [entityName] = args.constraints;
    return `${entityName} with id $value does not exist`;
  }
}

export function ExistEntity(
  entityName: keyof PrismaService,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entityName],
      validator: ExistEntityConstraint,
    });
  };
}
