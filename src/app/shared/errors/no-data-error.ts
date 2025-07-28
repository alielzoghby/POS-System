import { AppError } from './app-error';
export class NoDataError extends AppError {
  status = 204;
}
