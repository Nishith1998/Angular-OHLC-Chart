import { Injectable } from '@angular/core';
import { OrderBookComponent } from './order-book.component';
import { KeyValue } from '@angular/common';
import { UpdatedValuesFromWs, isUpdatedValuesFromWs } from 'src/app/models';

const INITIAL_TOTAL = 0;

@Injectable({
  providedIn: 'root'
})
export class OrderBookService {

  updateBookMap(this: OrderBookComponent,updatedValue: UpdatedValuesFromWs | UpdatedValuesFromWs[]): void {
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
    } else if (updatedValue) {
      updatedValue.forEach(([price, count, amount]: [price: number, count: number, amount: number]) => {
        if (amount < 0) {
          this.asksMap.set(price, [count, Math.abs(amount), INITIAL_TOTAL, price]);
        } else {
          this.bidsMap.set(price, [count, amount, INITIAL_TOTAL, price])
        }
      });
    }
  }

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
