import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { AuthProvider, UserRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateUserDto {
  // validation
  @IsOptional()
  @IsString()
  @MaxLength(50)
  //docs
  @ApiProperty()
  // graphql
  @Field(() => String, { nullable: true })
  last_name?: string;

  // validation
  @IsOptional()
  @IsString()
  @MaxLength(50)
  //docs
  @ApiProperty()
  // graphql
  @Field(() => String, { nullable: true })
  first_name?: string;

  // validation
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  //docs
  @ApiProperty()
  // graphql
  @Field(() => String)
  username: string;

  // validation
  @IsEmail()
  //docs
  @ApiProperty()
  // graphql
  @Field(() => String)
  email: string;

  // validation
  @IsString()
  @MinLength(6)
  //docs
  @ApiProperty()
  // graphql
  @Field(() => String)
  password: string;

  @IsString()
  //docs
  @ApiProperty()
  // graphql
  @Field(() => String)
  nativeLanguage: string;

  // validation
  @IsOptional()
  @IsString()
  //docs
  @ApiProperty()
  // graphql
  @Field(() => String, { nullable: true })
  profile_picture?: string;

  // validation
  @IsOptional()
  @IsEnum(UserRole)
  //docs
  // docs
  @ApiProperty({ enum: UserRole })
  // graphql
  @Field(() => UserRole, { nullable: true })
  role?: UserRole;

  // validation
  @IsOptional()
  @IsEnum(AuthProvider)
  // docs
  @ApiProperty({ enum: AuthProvider })
  // graphql
  @Field(() => AuthProvider, { nullable: true })
  auth_provider?: AuthProvider;
}
