import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'mapToDropdown', standalone: true })
export class MapToDropdownPipe implements PipeTransform {
  transform(items: any[]): any[] {
    return items?.map((i) => ({ label: i.name, value: i.isoCode || i.name })) ?? [];
  }
}
