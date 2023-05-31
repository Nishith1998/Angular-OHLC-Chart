import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Subject, map, skipWhile } from 'rxjs';
import { ChartPayload, GetAllSymbolsResp, TableDataType } from '../models';

const INDEX_OF_ORDERBOOK_ARRAY = 1;

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {

  selectedSymbol: Subject<string> = new Subject();

  constructor(private http: HttpClient, private ws: WebsocketService) { }

  getCandles(msg: ChartPayload) {
    return this.http.post('api/getCandles', msg);
  }

  getAllSymbols() {
    return this.http.get('api/getAllSymbols').pipe(
      map((sybmolData: any) => {
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
