import { Expose } from 'class-transformer';

export class Configuration {
  @Expose()
  tax!: number;
}
