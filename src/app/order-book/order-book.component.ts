import { Component } from '@angular/core';
import { ChartDataService } from '../services/chart-data.service';
import { INITIAL_PAYLOAD_FOR_ORDERBOOK } from '../constants';
import { OrderBookPayload, UpdatedValuesFromWs, isUpdatedValuesFromWs } from '../models';
import { ActivatedRoute, Params } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';
import { first } from 'rxjs';

const INDEX_OF_COUNT = 1;
const INDEX_OF_PRICE = 0;

@Component({
  selector: 'app-order-book',
  templateUrl: './order-book.component.html',
  styleUrls: ['./order-book.component.scss']
})
export class OrderBookComponent {
  bookMap: Map<number, [number, number, number]> = new Map();
  displayedColumns: string[] = ['']
  bookPayload: OrderBookPayload;

  constructor(private route: ActivatedRoute, private chartDataService: ChartDataService, private ws: WebsocketService) {

  }

  ngOnInit() {
    this.bookPayload = INITIAL_PAYLOAD_FOR_ORDERBOOK;
    this.route.queryParams.pipe(first()).subscribe((params: Params) => {
      // console.log("Params: ",params['symbol']);
      if (params['symbol']) {
        // this.ws.closeConnection();
        // this.ws.setConnection();
        this.bookMap = new Map();
        this.onSymbolChange(params['symbol']);
      }
    })

    // On Select OrdbookApi Call implmentation
    // this.chartDataService.selectedSymbol.subscribe((selectedValue: string) => {
    //   if(selectedValue)
    //   this.onSymbolChange(selectedValue);
    // })
  }

  onSymbolChange(value: string) {
    this.bookPayload.symbol = value;
    this.callOrderBookAPI();
  }

  callOrderBookAPI() {
    this.chartDataService.getOrderBookData(this.bookPayload).pipe().subscribe(data => {
      this.updateBookMap(data);
    })
  }

  updateBookMap(updatedValue: UpdatedValuesFromWs | UpdatedValuesFromWs[]) {
    if (isUpdatedValuesFromWs(updatedValue)) {
      // console.log("this is data update", updatedValue);
      if (updatedValue[INDEX_OF_COUNT] != 0) {
        this.bookMap.set(updatedValue[INDEX_OF_PRICE], updatedValue);
      } else {
        this.bookMap.delete(updatedValue[INDEX_OF_PRICE]);
      }
    } else if (typeof updatedValue[1] != 'string') {
      // console.log("this is data first", updatedValue);
      updatedValue.forEach((element: [number, number, number]) => {
        this.bookMap.set(element[INDEX_OF_PRICE], element);
      });
    }
  }
}
