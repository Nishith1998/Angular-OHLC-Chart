import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  sendMessage: Subject<string> = new Subject();
  receiveMessage: Subject<string> = new Subject();
  connectionOpened: boolean;
  ws: WebSocket;
  

  constructor() { 
    console.log("WebSocket::connection request")
    
    // this.setConnection();
    // this.ws.onopen = () => {
    //   this.connectionOpened = true;
    // };
    this.sendMessage.subscribe((msg: string) => {
      if(this.connectionOpened) {
        console.log("sending message")
        this.ws.send(msg);
      } 
      else if(this.connectionOpened == undefined){
        console.log("HERE I AM")
        this.ws.onopen = () => {
          console.log("connectionOpened")
          this.connectionOpened = true;
          this.ws.send(msg);
        };
      }
    });
    

  }

  setConnection() {
    this.ws = new WebSocket("wss://api-pub.bitfinex.com/ws/2");
    this.ws.onopen = () => {
      this.connectionOpened = true;
    };
    this.ws.onmessage = (event) => {
      // console.log(event);
      this.receiveMessage.next(event.data);
      console.log("websocket recieved data: ",event.data);
    };
  }

  closeConnection() {
    this.ws.close();
  }

}
