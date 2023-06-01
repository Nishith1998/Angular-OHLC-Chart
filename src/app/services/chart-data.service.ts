import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Observable, Subject, map, skipWhile } from 'rxjs';
import { ChartDataType, ChartPayload, GetAllSymbolsResp, TableDataType } from '../models';

const INDEX_OF_ORDERBOOK_ARRAY = 1;

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {

  selectedSymbol: Subject<string> = new Subject();

  constructor(private http: HttpClient, private ws: WebsocketService) { }

  getCandles(msg: ChartPayload): Observable<ChartDataType> {
    return this.http.post<ChartDataType>('api/getCandles', msg);
  }

  getAllSymbols(): Observable<TableDataType[]> {
    return this.http.get<GetAllSymbolsResp[]>('api/getAllSymbols').pipe(
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
