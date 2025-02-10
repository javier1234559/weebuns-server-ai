import { Injectable } from '@nestjs/common';

import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
@ValidatorConstraint({ name: 'existInDbBy', async: true })
export class ExistInDbByConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [property] = args.constraints;
    const { model: modelName, where } = property;

    const repository = this.prisma[modelName as keyof any];
    const processedWhere = this.processWhereConditions(where, value);

    try {
      const entity = await repository.findFirst({ where: processedWhere });
      return !!entity;
    } catch {
      return false;
    }
  }

  private processWhereConditions(where: Record<string, any>, value: any) {
    return Object.entries(where).reduce(
      (acc, [key, val]) => {
        acc[key] = val === '$value' ? value : val;
        return acc;
      },
      {} as Record<string, any>,
    );
  }

  defaultMessage(args: ValidationArguments): string {
    const [property] = args.constraints;
    const { model: modelName, where } = property;
    const conditions = Object.entries(where)
      .map(([key, val]) => `${key}: ${val === '$value' ? args.value : val}`)
      .join(', ');
    return `${modelName} not found with ${conditions}`;
  }
}

interface ExistInDbByOptions {
  model: string;
  where: Record<string, any>;
}

export function ExistInDbBy(
  options: ExistInDbByOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [options],
      validator: ExistInDbByConstraint,
    });
  };
}
