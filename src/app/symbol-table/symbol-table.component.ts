import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ChartDataService } from '../services/chart-data.service';
import { tableDataType } from '../models';
import { INITIAL_INDEX_FOR_CHART } from '../constants';

@Component({
  selector: 'app-symbol-table',
  templateUrl: './symbol-table.component.html',
  styleUrls: ['./symbol-table.component.scss']
})
export class SymbolTableComponent {

  getAllSymbols$: Observable<any>;
  displayedColumns: string[] = ['name', 'last'];
  
  selectedSymbol!: string;

  @Output() 
  symbolChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private chartDataService: ChartDataService) {
    this.getAllSymbols$ = this.chartDataService.getAllSymbols();
  }

  ngOnInit() {
    this.getAllSymbols$.subscribe((symbols: tableDataType[]) => {
      if (symbols) {
        this.selectedSymbol = symbols[INITIAL_INDEX_FOR_CHART].symbol;
        this.symbolChange.emit(this.selectedSymbol);
      }
    });
  }

  onSymbolSelect(selectedValue: string) {
    this.selectedSymbol = selectedValue;
    this.symbolChange.emit(this.selectedSymbol);
  }
}
