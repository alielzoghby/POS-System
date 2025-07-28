import { AppError } from './app-error';

export class ConflictError extends AppError {

  type = "";
  id!: number;

  constructor(errors?: string[]) {
    super(errors);
    if (errors && errors.length > 0) {
      this.checkErrorsInfo();
    }

  }

  private checkErrorsInfo() {
    for (let index = 0; index < this.errors.length; index++) {
      const error = this.errors[index];
      if (error.indexOf('type:') > -1) {
        let errorStringArray = error.split(':');
        if (errorStringArray.length > 1) {
          this.type = errorStringArray[1].trim()
        }
      }

      if (error.indexOf('id:') > -1) {
        let errorStringArray = error.split(':');
        if (errorStringArray.length > 1) {
          this.id = parseInt(errorStringArray[1].trim(), 10);
        }
      }

    }

  }

}
