import { Injectable } from '@angular/core';
import { OrderBookComponent } from './order-book.component';
import { KeyValue } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class OrderBookService {

  calcTotalBid(this:OrderBookComponent, index: number, itemValue: [number, number, number, number], list: KeyValue<number, [number, number, number, number]>[]): void {
    if (index == 0) {
      this.minBid = itemValue[this.INDEX_OF.AMOUNT];
      itemValue[this.INDEX_OF.TOTAL] = itemValue[this.INDEX_OF.AMOUNT];
    } else {
      itemValue[this.INDEX_OF.TOTAL] = list[index - 1].value[this.INDEX_OF.TOTAL] + itemValue[this.INDEX_OF.AMOUNT];
      if (index == this.LAST_INDEX)
        this.maxBid = itemValue[this.INDEX_OF.TOTAL];
    }
  }

  calcTotalAsk(this:OrderBookComponent, index: number, itemValue: [number, number, number, number], list: KeyValue<number, [number, number, number, number]>[]): void {
    if (index == 0) {
      this.minAsk = itemValue[this.INDEX_OF.AMOUNT];
      itemValue[this.INDEX_OF.TOTAL] = itemValue[this.INDEX_OF.AMOUNT];
    } else {
      itemValue[this.INDEX_OF.TOTAL] = list[index - 1].value[this.INDEX_OF.TOTAL] + itemValue[this.INDEX_OF.AMOUNT];
      if (index == this.LAST_INDEX)
        this.maxAsk = itemValue[this.INDEX_OF.TOTAL];
    }
  }
}
