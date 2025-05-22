import { InputType, Field } from '@nestjs/graphql';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { SkillType, UserRole } from '@prisma/client';
import { Type, Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
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
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  longBio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  introVideoUrlEmbed?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  certifications?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  teachingExperience?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  other?: string;

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
  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Field(() => String)
  username: string;

  @ApiProperty()
  @IsEmail()
  @Field(() => String)
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @Field(() => String)
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Field(() => String, { nullable: true })
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Field(() => String, { nullable: true })
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  profilePicture?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  bio?: string;

  @ApiProperty({ enum: UserRole, default: UserRole.user })
  @IsOptional()
  @IsEnum(UserRole)
  @Field(() => UserRole, { nullable: true })
  role?: UserRole;
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

  @ApiProperty({ required: false })
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
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  bio?: string;
}

export class UpdateProfileTeacherDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  email?: string;

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
  bio?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  profilePicture?: string;

  // For Teacher Profile
  @ApiProperty()
  @IsOptional()
  @IsString()
  longBio?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  introVideoUrlEmbed?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  certifications?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  teachingExperience?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  other?: string;
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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  longBio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  introVideoUrlEmbed?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  certifications?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  teachingExperience?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  other?: string;
}
