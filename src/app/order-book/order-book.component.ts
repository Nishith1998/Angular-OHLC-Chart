import { Component } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { map, skipWhile } from 'rxjs';
import { ChartDataService } from '../services/chart-data.service';

@Component({
  selector: 'app-order-book',
  templateUrl: './order-book.component.html',
  styleUrls: ['./order-book.component.scss']
})
export class OrderBookComponent {
  constructor(private chartDataService: ChartDataService) {
   
  }

  ngOnInit() {
    let msg = { 
      event: 'subscribe', 
      channel: 'book', 
      symbol: 'tBTCUSD' 
    }
    this.chartDataService.getOrderBookData(msg).subscribe(data => {console.log("this is data", data)})
  }

  dataMapping(values: number[]) {

  }
}
