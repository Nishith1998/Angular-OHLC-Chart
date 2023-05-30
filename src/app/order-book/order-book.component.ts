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
  bookMap: Map<any,any> = new Map();
  displayedColumns: string[] = ['']
  constructor(private chartDataService: ChartDataService) {
   
  }

  ngOnInit() {
    let msg = { 
      event: 'subscribe', 
      channel: 'book', 
      symbol: 'tBTCUSD' 
    }
    this.chartDataService.getOrderBookData(msg).subscribe(data => {
      if(data.length == 3) {
        console.log("this is data update", data);
        if(data[1] != 0) {
          this.bookMap.set(data[0], data);
        } else {
          this.bookMap.delete(data[0]);
        }
      } else {
        console.log("this is data first", data);
        data.forEach((element: any) => {
          this.bookMap.set(element[0], element);
        });
      }
    })
  }

  dataMapping(values: number[]) {

  }
}
