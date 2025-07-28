import { Expose } from 'class-transformer';

export class LookupModel  {
  @Expose() label!: string;
  @Expose() value!: string;
}
