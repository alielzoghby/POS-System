import { plainToClass } from 'class-transformer';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Mapper {
  fromJson(model: any, element: any): typeof model | (typeof model)[] {
    return plainToClass(model, element, {
      excludeExtraneousValues: true,
    });
  }
}
