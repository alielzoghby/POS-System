
export enum FeedbackType {
  Success,
  Warning,
  Failure,
}

export class FeedbackModel {

  constructor(
    public type: FeedbackType = FeedbackType.Success,
    public message: string = '',
    public duration: number | null = 5000,
    public url: string | null = '',
    public urlText: string | null = '',
    ) { }
}
