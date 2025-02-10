import { Injectable } from '@nestjs/common';

import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

import { PrismaService } from '../prisma/prisma.service';

@ValidatorConstraint({ name: 'existEntities', async: true })
@Injectable()
export class ExistEntitiesConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(values: string[], args: any) {
    if (!values?.length) return true; // Empty array is valid

    const [entityName] = args.constraints;
    const entity = (this.prisma as any)[entityName];

    if (!entity) return false;

    const records = await entity.findMany({
      where: {
        id: { in: values },
      },
    });

    return records.length === values.length;
  }

  defaultMessage(args: any) {
    const [entityName] = args.constraints;
    return `One or more ${entityName}s do not exist`;
  }
}

export function ExistEntities(
  entityName: keyof PrismaService,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entityName],
      validator: ExistEntitiesConstraint,
    });
  };
}
