import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ChartDataService } from '../services/chart-data.service';
import { TableDataType } from '../models';
import { INITIAL_INDEX_FOR_CHART } from '../constants';
import { Router } from '@angular/router';

@Component({
  selector: 'tickers-table',
  templateUrl: './tickers-table.component.html',
  styleUrls: ['./tickers-table.component.scss']
})
export class TickersTableComponent {

  getAllSymbols$: Observable<TableDataType[]>;
  displayedColumns: string[] = ['name', 'last', 'action'];
  
  selectedSymbol!: string;

  constructor(private router: Router, private chartDataService: ChartDataService) {
    this.getAllSymbols$ = this.chartDataService.getAllSymbols();
  }

  ngOnInit() {
    this.getAllSymbols$.subscribe((symbols: TableDataType[]) => {
      if (symbols) {
        this.onSymbolSelect(symbols[INITIAL_INDEX_FOR_CHART].symbol);
      }
    });
    this.chartDataService.selectedSymbol.subscribe((selectedValue: string) => {
      this.selectedSymbol = selectedValue;
    })
  }

  onSymbolSelect(selectedValue: string) {
    this.chartDataService.selectedSymbol.next(selectedValue);
  }

  openOrderBook(rowData: TableDataType) {
    console.log("rowData: ", rowData);
    this.router.navigate(['/orderBook'], {queryParams: {symbol: rowData.symbol}})
  }
}
