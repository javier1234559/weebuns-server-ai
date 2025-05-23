export enum SubmissionEventType {
  SUBMISSION_GRADED = 'submission.graded',
  SUBMISSION_CLAIMED = 'submission.claimed',
}

export class SubmissionGradedEvent {
  constructor(
    public readonly createdBy: string, // ID of teacher who graded
    public readonly userId: string, // ID of student who submitted
    public readonly submissionId: string,
    public readonly lessonTitle: string,
    public readonly content: string,
    public readonly thumbnailUrl?: string,
    public readonly actionUrl?: string,
  ) {}
}

export class SubmissionClaimedEvent {
  constructor(
    public readonly tokenUsed: number,
    public readonly teacherId: string,
  ) {}
}
