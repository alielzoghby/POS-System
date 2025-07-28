import { Expose } from "class-transformer";

export class DropdownData {
  @Expose() _id?: string;
  @Expose() value?: string;
}
