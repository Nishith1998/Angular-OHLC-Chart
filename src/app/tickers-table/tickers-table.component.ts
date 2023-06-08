import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiDataService } from '../services/api-data.service';
import { TickersTableDataType } from '../models';
import { ANGULAR_ROUTES, INITIAL_INDEX_FOR_CHART } from '../constants';
import { Router } from '@angular/router';

@Component({
  selector: 'tickers-table',
  templateUrl: './tickers-table.component.html',
  styleUrls: ['./tickers-table.component.scss']
})
export class TickersTableComponent implements OnInit {

  getAllSymbols$: Observable<TickersTableDataType[]>;
  displayedColumns: [string, string, string] = ['name', 'last', 'action'];
  selectedSymbol!: string;

  constructor(private router: Router, private apiDataService: ApiDataService) {
    this.getAllSymbols$ = this.apiDataService.getAllSymbols();
  }

  ngOnInit() {
    this.getAllSymbols$.subscribe((symbols: TickersTableDataType[]): void => {
      if (symbols && !this.apiDataService.selectedSymbolValue) {
        this.onSymbolSelect(symbols[INITIAL_INDEX_FOR_CHART].tickerSymbol);
      } else {
        this.onSymbolSelect(this.apiDataService.selectedSymbolValue);
      }
    });
    this.apiDataService.selectedSymbol.subscribe((selectedValue: string): void => {
      this.selectedSymbol = selectedValue;
    })
  }

  onSymbolSelect(selectedValue: string): void {
    this.apiDataService.selectedSymbol.next(selectedValue);
  }

  openOrderBook(rowData: TickersTableDataType): void {
    if(this.router.routerState.snapshot.url.startsWith(ANGULAR_ROUTES.HOME))
      this.router.navigate([ANGULAR_ROUTES.ORDERBOOK], {queryParams: {symbol: rowData.tickerSymbol}});
    else if(this.router.routerState.snapshot.url.startsWith(ANGULAR_ROUTES.ORDERBOOK))
      this.router.navigate([ANGULAR_ROUTES.HOME], {queryParams: {symbol: rowData.tickerSymbol}});
    
  }

}
