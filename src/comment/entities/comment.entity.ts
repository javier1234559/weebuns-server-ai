import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { CommentReaction } from '../../generated-dto/comment-reaction/entities/comment-reaction.entity';
import { ID } from '@nestjs/graphql';
import { Field } from '@nestjs/graphql';
import { IComment } from '../interface/comment.interface';

export class Comment implements IComment {
  @Field(() => ID)
  @ApiProperty({
    example: '00321d6f-2bcf-4985-9659-92a571275da6',
    type: 'string',
  })
  id: string;

  @Field(() => String)
  @ApiProperty({
    example: '00321d6f-2bcf-4985-9659-92a571275da6',
    type: 'string',
  })
  userId: string;

  @Field(() => String, { nullable: true })
  @ApiProperty({
    example: '00321d6f-2bcf-4985-9659-92a571275da6',
    type: 'string',
    nullable: true,
  })
  parentId: string | null;

  @Field(() => String)
  @ApiProperty({
    example: '00321d6f-2bcf-4985-9659-92a571275da6',
    type: 'string',
  })
  entityId: string;

  @Field(() => String)
  @ApiProperty({
    example: 'This is a comment',
    type: 'string',
  })
  content: string;
  
  @Field(() => Boolean)
  @ApiProperty({
    example: false,
    type: 'boolean',
  })
  isEdited: boolean;
  
  @Field(() => Date)
  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  
  @Field(() => Date)
  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  deletedAt: Date | null;

  @Field(() => User, { nullable: true })
  @ApiProperty({
    type: () => User,
    required: false,
  })
  user?: User;

  @Field(() => Comment, { nullable: true })
  @ApiProperty({
    type: () => Comment,
    required: false,
    nullable: true,
  })
  parent?: Comment | null;

  @Field(() => [Comment], { nullable: true })
  @ApiProperty({
    type: () => Comment,
    isArray: true,
    required: false,
  })
  replies?: Comment[];

  @Field(() => [CommentReaction], { nullable: true })
  @ApiProperty({
    type: () => CommentReaction,
    isArray: true,
    required: false,
  })
  reactions?: CommentReaction[];
}
