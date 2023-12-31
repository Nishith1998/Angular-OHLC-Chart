import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiDataService } from '../services/api-data.service';
import { first } from 'rxjs';
import { CHART_SERIES_NAME, INITIAL_TIME_FRAME_FOR_CHART, getChartOptions, timeSpansList } from '../constants';
import { ChartDataType, ChartOptions, ChartPayload, TimeFrame } from '../models';

@Component({
  selector: 'ohlc-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  chartData: ChartDataType[];
  chartOptions: ChartOptions;
  candlePayload: ChartPayload;
  ohlcOnHover: { o: number; h: number; l: number; c: number; };
  timeSpansList: TimeFrame[] = timeSpansList;
  selectedTimeFrame: TimeFrame | null;
  selectedSymbol: string;

  constructor(public changeDetectorRef: ChangeDetectorRef, private apiDataService: ApiDataService) { }

  ngOnInit() {
    this.chartOptions = getChartOptions.apply(this);

    this.candlePayload = {
      symbol: '',
      timeFrame: INITIAL_TIME_FRAME_FOR_CHART
    };

    this.apiDataService.selectedSymbol.subscribe((selectedValue: string): void => {
      this.onSymbolChange(selectedValue);
    })
  }

  onSymbolChange(changedValue: string): void {
    this.selectedSymbol = changedValue;
    this.candlePayload.symbol = changedValue;
    this.callCandleAPI();
  }

  onTimeFrameChange(timeFrame: TimeFrame): void {
    this.selectedTimeFrame = timeFrame;
    this.candlePayload.timeFrame = timeFrame.value;
    this.callCandleAPI();
  }

  callCandleAPI(): void {
    this.apiDataService.getCandles(this.candlePayload).pipe(first()).subscribe({
      next: (data: ChartDataType[]) => {
        this.updateChartOptions(data);
      }
    });
  }

  updateChartOptions(data: ChartDataType[]): void {
    this.chartData = data;
    this.chartOptions.series = [
      {
        name: CHART_SERIES_NAME,
        data: this.chartData
      }
    ]
  }

}
