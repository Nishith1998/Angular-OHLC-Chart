import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  sendMessage: Subject<any> = new Subject();
  receiveMessage: Subject<any> = new Subject();

  constructor() { 
    console.log("WebSocket::connection request")
    let ws = new WebSocket("wss://api-pub.bitfinex.com/ws/2");

    this.sendMessage.subscribe((msg: any) => {
      ws.onopen = (event) => {
        ws.send(msg);
      };
    })

    ws.onmessage = (event) => {
      // console.log(event);
      this.receiveMessage.next(event.data);
      // console.log("websocket recieved data: ",event.data);
    };
    

  }

}
