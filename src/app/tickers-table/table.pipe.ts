import { Pipe, PipeTransform } from '@angular/core';
import { TableDataType } from '../models';

@Pipe({
  name: 'table'
})
export class TablePipe implements PipeTransform {

  transform(value: TableDataType, type: string): string {
    if(type == 'name')
      return value.symbol.substring(1,4);
    else if( type == 'unit')
      return value.symbol.substring(4,);
    else
      return ''
  }

}
