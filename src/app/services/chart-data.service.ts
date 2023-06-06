import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Observable, Subject, map, skipWhile } from 'rxjs';
import { ChartDataType, ChartPayload, GetAllSymbolsResp, TableDataType, candleMapping, getCandleResp } from '../models';
import { URLs } from '../constants';

const INDEX_OF_ORDERBOOK_ARRAY = 1;

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {

  selectedSymbol: Subject<string> = new Subject();
  selectedSymbolValue: string;

  constructor(private http: HttpClient, private ws: WebsocketService) { 
    this.selectedSymbol.subscribe(data => { if(data) this.selectedSymbolValue = data });
  }

  getCandles(payload: ChartPayload): Observable<ChartDataType[]> {
    return this.http.post<getCandleResp>(URLs.getCandles, payload)
    .pipe(
      map((candleData: getCandleResp) => {
        return candleMapping(candleData);
      })
    );
  }

  getAllSymbols(): Observable<TableDataType[]> {
    return this.http.get<GetAllSymbolsResp[]>(URLs.getAllSymbols).pipe(
      map((sybmolData: GetAllSymbolsResp[]) => {
        return TableDataType.mapToTableDataType(sybmolData);
      })
    )
  }

  getOrderBookData(payload: {event: string, channel: string, symbol: string}) {
    let msg = JSON.stringify(payload)  
    this.ws.sendMessage.next(msg);
    return this.ws.receiveMessage.pipe(
      map(data => JSON.parse(data)), 
      skipWhile((data) => { 
        return data.event != undefined 
      }), 
      map(data => data[INDEX_OF_ORDERBOOK_ARRAY])
    );
  }
}
