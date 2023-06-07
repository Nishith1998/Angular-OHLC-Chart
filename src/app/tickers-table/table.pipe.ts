import { Pipe, PipeTransform } from '@angular/core';
import { TableDataType } from '../models';

@Pipe({
  name: 'table'
})
export class TablePipe implements PipeTransform {
  readonly SUBSTRING_MIN_INDEX = 1;
  readonly SUBSTRING_MAX_INDEX = 4;

  transform(value: TableDataType, type: string): string {
    if(type == 'name')
      return value.symbol.substring(this.SUBSTRING_MIN_INDEX,this.SUBSTRING_MAX_INDEX);
    else if( type == 'unit')
      return value.unit//.symbol.substring(this.SUBSTRING_MAX_INDEX,).replace(':', '').replace('F0', '').replace('F0', '');
    else
      return '';
  }

}
