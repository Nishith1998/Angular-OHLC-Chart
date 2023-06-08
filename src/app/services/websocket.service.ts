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
      if (this.connectionOpened && this.ws.readyState === 1) {
        this.ws.send(msg);
      }
      else {
        this.ws.onopen = (): void => {
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
    };
    this.ws.onopen = (): void => {
      this.connectionOpened = true;
    };
  }

  closeConnection() {
    this.ws.close();
  }

}
