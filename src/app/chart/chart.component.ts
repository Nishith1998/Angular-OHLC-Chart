import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartDataService } from '../services/chart-data.service';
import { first } from 'rxjs';
import { INITIAL_TIME_FRAME_FOR_CHART, getChartOptions, timeSpansList } from '../constants';
import { ChartDataType, ChartOptions, ChartPayload, TimeFrame } from '../models';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  chartData: ChartDataType;
  chartOptions: ChartOptions;
  candlePayload: ChartPayload;
  ohlcOnHover: { o: number; h: number; l: number; c: number; };
  timeSpansList: TimeFrame[] = timeSpansList;
  selectedTimeFrame: TimeFrame;
  selectedTimeSpan: { label: string, value: string } | null;
  selectedSymbol: string;

  constructor(public cdr: ChangeDetectorRef, private chartDataService: ChartDataService) { }

  ngOnInit() {
    this.chartOptions = getChartOptions.apply(this);

    this.candlePayload = {
      symbol: '',
      timeFrame: INITIAL_TIME_FRAME_FOR_CHART
    };

    this.chartDataService.selectedSymbol.subscribe((selectedValue: string) => {
      this.onSymbolChange(selectedValue);
    })
  }


  updateChartOptions(data: ChartDataType): void {
    this.chartData = data;
    this.chartOptions.series = [
      {
        name: "My-series",
        data: this.chartData
      }
    ]
  }

  callCandleAPI() {
    this.chartDataService.getCandles(this.candlePayload).pipe(first()).subscribe({
      next: (data: ChartDataType) => {
        this.updateChartOptions(data);
      }
    });
  }

  onSymbolChange(changedValue: string) {
    this.selectedSymbol = changedValue;
    this.candlePayload.symbol = changedValue;
    this.callCandleAPI();
  }

  onTimeFrameChange(timeFrame: TimeFrame) {
    this.selectedTimeSpan = timeFrame;
    this.candlePayload.timeFrame = timeFrame.value;
    this.callCandleAPI();
  }

}
