import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { map, skipWhile } from 'rxjs';

const candleMapping = (data: any) => {
  console.log("data in cangleMapping: ", data)

  if (Array.isArray(data)) {
    if (Array.isArray(data[0])) {
      return data.map((ele: any) => {
        return {
          x: new Date(ele[0]),
          y: [ele[1], ele[2], ele[3], ele[4]]
        }
      })
    } else {
      return {
        x: new Date(data[0]),
        y: [data[1], data[2], data[3], data[4]]
      }
    }
    // return map values according to it
  } else {
    return undefined
  }
}

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {

  constructor(private http: HttpClient, public ws: WebsocketService) { }

  getCandles(msg: any) {
    console.log("payload: getCandles ", msg)
    return this.http.post('api/getCandles', msg);
    // debugger
    // this.ws.sendMessage.next(msg);
    // return this.ws.receiveMessage.pipe(map(data => JSON.parse(data)), skipWhile((data) => { return data.event != undefined }), map(data => candleMapping(data[1])));
  }

  getAllSymbols() {
    return this.http.get('api/getAllSymbols')
  }
}
