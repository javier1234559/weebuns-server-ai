import { InputType, Field } from '@nestjs/graphql';
import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { SkillType, UserRole, AuthProvider } from '@prisma/client';
import { Type, Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  IsDecimal,
  IsDate,
  MaxLength,
  MinLength,
  IsEmail,
  IsEnum,
} from 'class-validator';

export class ProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  // Teacher Profile
  @ApiProperty({ required: false, type: [String], enum: SkillType })
  @IsOptional()
  @IsArray()
  specialization?: SkillType[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  qualification?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  teachingExperience?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return value;
  })
  hourlyRate?: number;

  // Student Profile
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  targetStudyDuration?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  targetReading?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  targetListening?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  targetWriting?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  targetSpeaking?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  nextExamDate?: Date;
}

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

export class CreateTeacherDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiProperty({ type: [String], enum: SkillType })
  specialization: SkillType[];

  @ApiProperty()
  @IsString()
  qualification: string;

  @ApiProperty()
  @IsNumber()
  teachingExperience: number;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return value;
  })
  hourlyRate: number;
}

@InputType()
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const),
) {}

export class UpdateProfileDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  profilePicture?: string;

  // For Teacher Profile
  @ApiProperty({ type: [String], enum: SkillType })
  @IsOptional()
  specialization?: SkillType[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  qualification?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  teachingExperience?: number;

  @ApiProperty()
  @IsOptional()
  @IsDecimal()
  hourlyRate?: number;

  // For Student Profile
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  targetStudyDuration?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  targetReading?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  targetListening?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  targetWriting?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  targetSpeaking?: number;

  @ApiProperty()
  @IsOptional()
  nextExamDate?: Date;
}

@InputType()
export class UpdateProfileUserDto {
  @MinLength(3)
  //docs
  @ApiProperty()
  username: string;

  //docs
  @ApiProperty()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  //docs
  @ApiProperty()
  firstName?: string;

  @IsString()
  @IsOptional()
  //docs
  @ApiProperty()
  lastName?: string;

  @IsString()
  //docs
  @ApiProperty()
  @IsOptional()
  nativeLanguage: string;

  @ApiProperty()
  @IsOptional()
  profilePicture: string;
}

export class TeacherDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiProperty({ type: [String], enum: SkillType })
  @IsArray()
  specialization: SkillType[];

  @ApiProperty()
  @IsString()
  qualification: string;

  @ApiProperty()
  @IsNumber()
  teachingExperience: number;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return value;
  })
  hourlyRate: number;
}
