import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { $Enums, AuthProvider, UserRole } from '@prisma/client';

import { LanguageCode } from 'src/common/enum/common';

import { IUser } from '../user.interface';

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User roles in the system',
});

registerEnumType(AuthProvider, {
  name: 'AuthProvider',
  description: 'Authentication providers',
});

registerEnumType(LanguageCode, {
  name: 'LanguageCode',
  description: 'Available language codes',
});

@ObjectType()
export class User implements IUser {
  @Field(() => ID)
  @ApiProperty({
    example: '00321d6f-2bcf-4985-9659-92a571275da6',
  })
  id: string;

  @Field()
  @ApiProperty({ example: 'johndoe' })
  username: string;

  @Field()
  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @Field(() => String, { nullable: true })
  @ApiProperty({
    nullable: true,
  })
  passwordHash: string | null;

  @Field(() => UserRole)
  @ApiProperty({
    enum: UserRole,
    example: UserRole.user,
    description: 'User role in the system',
  })
  role: UserRole;

  @Field(() => AuthProvider)
  @ApiProperty({
    enum: AuthProvider,
    example: AuthProvider.local,
    description: 'Authentication provider used',
  })
  authProvider: $Enums.AuthProvider;

  @Field(() => String, { nullable: true })
  @ApiProperty({
    nullable: true,
  })
  authProviderId: string | null;

  @Field(() => String, { nullable: true })
  @ApiProperty({
    example: 'John',
    nullable: true,
  })
  firstName: string | null;

  @Field(() => String, { nullable: true })
  @ApiProperty({
    example: 'Doe',
    nullable: true,
  })
  lastName: string | null;

  @Field(() => String, { nullable: true })
  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    nullable: true,
  })
  profilePicture: string | null;

  @Field()
  @ApiProperty({
    example: false,
  })
  isEmailVerified: boolean;

  @Field(() => LanguageCode)
  @ApiProperty({
    enum: LanguageCode,
    example: LanguageCode.VIETNAMESE,
    description: "User's native language",
  })
  nativeLanguage: string;

  @Field(() => Date, { nullable: true })
  @ApiProperty({
    nullable: true,
  })
  lastLogin: Date | null;

  @Field(() => Date)
  @ApiProperty()
  createdAt: Date;

  @Field(() => Date)
  @ApiProperty()
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @ApiProperty({
    nullable: true,
    description: 'Timestamp when the user was deleted (soft delete)',
  })
  deletedAt: Date | null;

  // // Relationships
  // @ApiProperty({
  //   type: () => [Course],
  //   nullable: true,
  // })
  // courses?: Course[];

  // @ApiProperty({
  //   type: () => [CourseProgress],
  //   nullable: true,
  //   description: 'Progress tracking for enrolled courses',
  // })
  // courseProgress?: CourseProgress[];

  // @ApiProperty({
  //   type: () => [Note],
  //   nullable: true,
  //   description: 'Notes created by the user',
  // })
  // notes?: Note[];

  // @ApiProperty({
  //   type: () => [Vocabulary],
  //   nullable: true,
  //   description: 'Vocabulary items created by the user',
  // })
  // vocabularies?: Vocabulary[];

  // @ApiProperty({
  //   type: () => [Space],
  //   nullable: true,
  //   description: 'Learning spaces created by the user',
  // })
  // spaces?: Space[];

  // @ApiProperty({
  //   type: () => [Essay],
  //   nullable: true,
  //   description: 'Essays written by the user',
  // })
  // essays?: Essay[];

  // @ApiProperty({
  //   type: () => [Correction],
  //   nullable: true,
  //   description: 'Corrections made by the user',
  // })
  // corrections?: Correction[];

  // @ApiProperty({
  //   type: () => [CorrectionReply],
  //   nullable: true,
  //   description: 'Replies to corrections',
  // })
  // correctionReplies?: CorrectionReply[];

  // @ApiProperty({
  //   type: () => LessonComment,
  //   isArray: true,
  //   required: false,
  // })
  // lessonComments?: LessonComment[];

  // @ApiProperty({
  //   type: () => [Subscription],
  //   nullable: true,
  //   description: 'User subscriptions',
  // })
  // subscriptions?: Subscription[];

  // @ApiProperty({
  //   type: () => [CorrectionCredit],
  //   nullable: true,
  //   description: 'Correction credits owned by the user',
  // })
  // correctionCredits?: CorrectionCredit[];
}
