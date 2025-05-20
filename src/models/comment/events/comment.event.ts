import { NotificationType } from '@prisma/client';

export class CommentCreatedEvent {
  constructor(
    public readonly createdBy: string,
    public readonly userId: string,
    public readonly type: NotificationType,
    public readonly title: string,
    public readonly content: string,
    public readonly thumbnailUrl?: string,
    public readonly actionUrl?: string,
    public readonly isGlobal?: boolean,
  ) {}
}

export class CommentRepliedEvent {
  constructor(
    public readonly createdBy: string,
    public readonly userId: string,
    public readonly type: NotificationType,
    public readonly title: string,
    public readonly content: string,
    public readonly thumbnailUrl?: string,
    public readonly actionUrl?: string,
    public readonly isGlobal?: boolean,
  ) {}
}
