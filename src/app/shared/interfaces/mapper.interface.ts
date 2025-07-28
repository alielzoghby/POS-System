import { LanguageEnum } from "../enums/language.enum";

export interface MapperInterface<Type> {
  fromJson(json: any, language: LanguageEnum): Type;
  fromList(json: any, language: LanguageEnum): Type[];
}
