import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { URLs } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  sendMessage: Subject<string> = new Subject();
  receiveMessage: Subject<string> = new Subject();
  connectionOpened: boolean;
  ws: WebSocket;
  

  constructor() { 
    
    this.sendMessage.subscribe((msg: string): void => {
      if(this.connectionOpened && this.ws.readyState === 1) { // 
        // console.log("sending message")
        this.ws.send(msg);
      } 
      else {
        // console.log("Connection not opened yet...")
        this.ws.onopen = (): void => {
          // console.log("connection opened now")
          this.connectionOpened = true;
          this.ws.send(msg);
        };
      }
    });
    

  }

  setConnection() {
    this.ws = new WebSocket(URLs.getOrderBook);
    this.ws.onmessage = (event: MessageEvent<string>): void => {
      this.receiveMessage.next(event.data);
      // console.log("websocket recieved data: ",event.data);
    };
    this.ws.onopen = (): void => {
      console.log("connectionOpened")
      this.connectionOpened = true;
    };
  }

  closeConnection() {
    this.ws.close();
  }

}
