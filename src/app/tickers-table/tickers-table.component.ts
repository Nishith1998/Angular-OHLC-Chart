import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChartDataService } from '../services/chart-data.service';
import { TableDataType } from '../models';
import { ANGULAR_ROUTES, INITIAL_INDEX_FOR_CHART } from '../constants';
import { Router } from '@angular/router';

@Component({
  selector: 'tickers-table',
  templateUrl: './tickers-table.component.html',
  styleUrls: ['./tickers-table.component.scss']
})
export class TickersTableComponent implements OnInit {

  getAllSymbols$: Observable<TableDataType[]>;
  displayedColumns: [string, string, string] = ['name', 'last', 'action'];
  selectedSymbol!: string;

  constructor(private router: Router, private chartDataService: ChartDataService) {
    this.getAllSymbols$ = this.chartDataService.getAllSymbols();
  }

  ngOnInit() {
    this.getAllSymbols$.subscribe((symbols: TableDataType[]): void => {
      if (symbols && !this.chartDataService.selectedSymbolValue) {
        this.onSymbolSelect(symbols[INITIAL_INDEX_FOR_CHART].symbol);
      } else {
        this.onSymbolSelect(this.chartDataService.selectedSymbolValue);
      }
    });
    this.chartDataService.selectedSymbol.subscribe((selectedValue: string): void => {
      this.selectedSymbol = selectedValue;
    })
  }

  onSymbolSelect(selectedValue: string): void {
    this.chartDataService.selectedSymbol.next(selectedValue);
  }

  openOrderBook(rowData: TableDataType): void {
    // console.log("rowData: ", rowData);
    if(this.router.routerState.snapshot.url.startsWith(ANGULAR_ROUTES.HOME))
      this.router.navigate([ANGULAR_ROUTES.ORDERBOOK], {queryParams: {symbol: rowData.symbol}});
    else if(this.router.routerState.snapshot.url.startsWith(ANGULAR_ROUTES.ORDERBOOK))
      this.router.navigate([ANGULAR_ROUTES.HOME], {queryParams: {symbol: rowData.symbol}});
    
  }

}
