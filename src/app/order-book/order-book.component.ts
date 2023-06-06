import { ChangeDetectorRef, Component } from '@angular/core';
import { ChartDataService } from '../services/chart-data.service';
import { INITIAL_PAYLOAD_FOR_ORDERBOOK } from '../constants';
import { OrderBookPayload, UpdatedValuesFromWs, isUpdatedValuesFromWs } from '../models';
import { ActivatedRoute, Params } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';
import { first } from 'rxjs';

const INDEX_OF_COUNT = 1;
const INDEX_OF_PRICE = 0;
const INITIAL_TOTAL = 0;

@Component({
  selector: 'app-order-book',
  templateUrl: './order-book.component.html',
  styleUrls: ['./order-book.component.scss']
})
export class OrderBookComponent {
  bidsMap: Map<number, [number, number, number, number]> = new Map();
  asksMap: Map<number, [number, number, number, number]> = new Map();
  displayedColumns: string[] = ['']
  bookPayload: OrderBookPayload;

  constructor(public changeDetectorRef: ChangeDetectorRef, private route: ActivatedRoute, private chartDataService: ChartDataService, private ws: WebsocketService) {
    this.ws.setConnection();
  }

  ngOnInit() {
    this.bookPayload = INITIAL_PAYLOAD_FOR_ORDERBOOK;
    this.route.queryParams.pipe(first()).subscribe((params: Params) => {
      if (params['symbol']) {
        this.chartDataService.selectedSymbol.next(params['symbol']);
      }
    })

    // On Select OrdbookApi Call implmentation
    this.chartDataService.selectedSymbol.subscribe((selectedValue: string) => {
      if(selectedValue) {
        this.onSymbolChange(selectedValue);
      }
    })
  }

  onSymbolChange(value: string) {
      this.asksMap.clear();
      this.bidsMap.clear();
      this.changeDetectorRef.detectChanges();

    this.bookPayload.symbol = value;
    this.callOrderBookAPI();
  }

  callOrderBookAPI() {
    this.chartDataService.getOrderBookData(this.bookPayload).subscribe(data => {
      this.updateBookMap(data);
    })
  }

  updateBookMap(updatedValue: UpdatedValuesFromWs | UpdatedValuesFromWs[]) {
    if (isUpdatedValuesFromWs(updatedValue)) {
      let [price,count, amount] = [...updatedValue];
      if (updatedValue[INDEX_OF_COUNT] != 0) {
        if(updatedValue[2] < 0) {
          this.asksMap.set(price, [count, Math.abs(amount), INITIAL_TOTAL, price]);
        } else {
          this.bidsMap.set(price, [count, Math.abs(amount), INITIAL_TOTAL, price]);
        }
      } else {
        this.asksMap.delete(updatedValue[INDEX_OF_PRICE]);
        this.bidsMap.delete(updatedValue[INDEX_OF_PRICE]);
      }
    } else if (updatedValue && typeof updatedValue[1] != 'string') {
      updatedValue.forEach(([price, count, amount]: [price:number, count:number, amount:number]) => {
        if(amount < 0) {
          this.asksMap.set(price, [count, Math.abs(amount), INITIAL_TOTAL, price]);
        } else { // amount > 0
          this.bidsMap.set(price, [count, amount, INITIAL_TOTAL, price])
        }
      });
    }
  }

  minBid: number;
  maxBid: number;
  calcTotalBid(index: number, itemValue: any[], list: any[]) {

    if(index == 0) {
      this.minBid = itemValue[1];
      itemValue[2] = itemValue[1];
    } else {
      itemValue[2] = list[index-1].value[2] + itemValue[1];
      if(index == 18)
        this.maxBid = itemValue[2];
    }
  }

  minAsk: number;
  maxAsk: number;
  calcTotalAsk(index: number, itemValue: any[], list: any[]) {

    if(index == 0) {
      this.minAsk = itemValue[1];
      itemValue[2] = itemValue[1];
    } else {
      itemValue[2] = list[index-1].value[2] + itemValue[1];
      if(index == 18)
        this.maxAsk = itemValue[2];
    }
  }

  ngOnDestroy() {
    this.ws.closeConnection();
  }
}
