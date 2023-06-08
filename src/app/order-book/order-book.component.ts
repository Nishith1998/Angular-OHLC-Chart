import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ApiDataService } from '../services/api-data.service';
import { INITIAL_PAYLOAD_FOR_ORDERBOOK, QUERY_PARAM_SYMBOL } from '../constants';
import { OrderBookPayload, UpdatedValuesFromWs, isUpdatedValuesFromWs } from '../models';
import { ActivatedRoute, Params } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';
import { first } from 'rxjs';
import { OrderBookService } from './order-book.service';

const INITIAL_TOTAL = 0;

@Component({
  selector: 'app-order-book',
  templateUrl: './order-book.component.html',
  styleUrls: ['./order-book.component.scss']
})
export class OrderBookComponent implements OnInit, OnDestroy {
  bidsMap: Map<number, [number, number, number, number]> = new Map();
  asksMap: Map<number, [number, number, number, number]> = new Map();
  minBid: number; maxBid: number; 
  minAsk: number; maxAsk: number;

  bookPayload: OrderBookPayload;

  readonly INDEX_OF = {
    COUNT: 0,
    AMOUNT: 1,
    TOTAL: 2,
    PRICE: 3
  }
  readonly LAST_INDEX = 18;

  constructor(public orderBookService: OrderBookService,public changeDetectorRef: ChangeDetectorRef, private route: ActivatedRoute, private apiDataService: ApiDataService, private ws: WebsocketService) {
    this.ws.setConnection();
  }

  ngOnInit() {
    this.bookPayload = INITIAL_PAYLOAD_FOR_ORDERBOOK;
    this.route.queryParams.pipe(first()).subscribe((params: Params): void => {
      if (params[QUERY_PARAM_SYMBOL]) {
        this.apiDataService.selectedSymbol.next(params[QUERY_PARAM_SYMBOL]);
      }
    })

    this.apiDataService.selectedSymbol.subscribe((selectedValue: string): void => {
      if (selectedValue) {
        this.onSymbolChange(selectedValue);
      }
    })
  }

  onSymbolChange(symbolValue: string): void {
    this.asksMap.clear();
    this.bidsMap.clear();
    this.changeDetectorRef.detectChanges();

    this.bookPayload.symbol = symbolValue;
    this.callOrderBookAPI();
  }

  callOrderBookAPI(): void {
    this.apiDataService.getOrderBookData(this.bookPayload).subscribe((data: UpdatedValuesFromWs | UpdatedValuesFromWs[]) => {
      this.updateBookMap(data);
    })
  }

  updateBookMap(updatedValue: UpdatedValuesFromWs | UpdatedValuesFromWs[]): void {
    if (isUpdatedValuesFromWs(updatedValue)) {
      const [price, count, amount] = [...updatedValue];
      if (count != 0) {
        if (amount < 0) {
          this.asksMap.set(price, [count, Math.abs(amount), INITIAL_TOTAL, price]);
        } else {
          this.bidsMap.set(price, [count, Math.abs(amount), INITIAL_TOTAL, price]);
        }
      } else {
        this.asksMap.delete(price);
        this.bidsMap.delete(price);
      }
    } else if (updatedValue) { // do not type check
      updatedValue.forEach(([price, count, amount]: [price: number, count: number, amount: number]) => {
        if (amount < 0) {
          this.asksMap.set(price, [count, Math.abs(amount), INITIAL_TOTAL, price]);
        } else {
          this.bidsMap.set(price, [count, amount, INITIAL_TOTAL, price])
        }
      });
    }
  }

  ngOnDestroy() {
    this.ws.closeConnection();
  }
}
