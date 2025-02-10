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
@ValidatorConstraint({ name: 'existInDb', async: true })
export class ExistInDbConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [property] = args.constraints;
    const { model: modelName, field = 'id' } = property;

    const repository = this.prisma[modelName as keyof any];
    const where = { [field]: value };

    try {
      const entity = await repository.findUnique({ where });
      return !!entity;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    const [property] = args.constraints;
    const { model: modelName, field = 'id' } = property;
    return `${modelName} with ${field} '${args.value}' not found`;
  }
}

interface ExistInDbOptions {
  model: string;
  field?: string;
}

export function ExistInDb(
  options: ExistInDbOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [options],
      validator: ExistInDbConstraint,
    });
  };
}
