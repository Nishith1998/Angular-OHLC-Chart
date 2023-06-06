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
    
    this.sendMessage.subscribe((msg: string) => {
      if(this.connectionOpened && this.ws.readyState == 1) {
        console.log("sending message")
        this.ws.send(msg);
      } 
      else {//if(this.connectionOpened == undefined){
        console.log("Connection not opened yet...")
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
    this.ws.onmessage = (event) => {
      this.receiveMessage.next(event.data);
      // console.log("websocket recieved data: ",event.data);
    };
    this.ws.onopen = () => {
      console.log("connectionOpened")
      this.connectionOpened = true;
      // this.ws.send(msg);
    };
  }

  closeConnection() {
    this.ws.close();
  }

}
