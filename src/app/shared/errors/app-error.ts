export class AppError {
  constructor(
    public errors: string[] = [],
    public code?: number
  ) {}
}
