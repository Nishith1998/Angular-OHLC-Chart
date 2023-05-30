import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataService } from '../services/chart-data.service';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, ApexPlotOptions, ApexTooltip } from 'ng-apexcharts';
import { Observable, first, map, pipe } from 'rxjs';
import { WebsocketService } from '../services/websocket.service';
import { INITIAL_TIME_FRAME_FOR_CHART, timeSpansList } from '../constants';
import { chartDataType, chartPayload, labelValuePair } from '../models';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  chartData: chartDataType;
  chartOptions: ChartOptions;
  candlePayload: chartPayload;
  ohlcOnHover: { o: number; h: number; l: number; c: number; };
  timeSpansList: labelValuePair[] = timeSpansList;
  selectedTimeFrame: labelValuePair;
  selectedTimeSpan: { label: string, value: string } | null;

  constructor(private cdr: ChangeDetectorRef, public chartDataService: ChartDataService) {

  }

  ngOnInit() {
    this.candlePayload = {
      symbol: '',
      timeFrame: INITIAL_TIME_FRAME_FOR_CHART
    }
  }


  updateChartOptions(data: chartDataType) {
    this.chartData = data;
    this.chartOptions = {
      series: [
        {
          name: "My-series",
          data: this.chartData //.map(data => {return {...data, x: new Date(data.x)}}).slice(0,5)
        }
      ],
      chart: {
        events: {
          zoomed: (chartContext: any, { xaxis, yaxis }: { xaxis: any, yaxis: any }) => {
            this.selectedTimeSpan = null;
            console.log("zoomed", chartContext, xaxis, yaxis);
          }
        },
        height: 350,
        type: "candlestick",
        zoom: {
          enabled: true,
          type: 'x',
          autoScaleYaxis: true,
        }
      },
      xaxis: {
        type: "datetime",
        tooltip: {
          formatter: function (val: any) {
            // console.log("formatter value: ", val)
            let date = new Date(val);
            return date.toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric' }) + ' ' + date.toLocaleTimeString().substring(0, 5);
          }
        }
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: "green",
            downward: "red"
          },
          wick: {
            useFillColor: true
          }
        }
      },
      tooltip: {
        enabled: true,
        cssClass: "my-tooltip",
        custom: ({ series, seriesIndex, dataPointIndex, w }: { series: any, seriesIndex: any, dataPointIndex: any, w: any }) => {
          console.log("tooltip data: ", series,
            seriesIndex,
            dataPointIndex,
            w)
          this.ohlcOnHover =
          {
            o: w.globals.seriesCandleO[0][dataPointIndex],
            h: w.globals.seriesCandleH[0][dataPointIndex],
            l: w.globals.seriesCandleL[0][dataPointIndex],
            c: w.globals.seriesCandleC[0][dataPointIndex]
          };
          this.cdr.detectChanges();
        }
      }
    };
  }

  callCandleAPI() {
    this.chartDataService.getCandles(this.candlePayload).pipe(first()).subscribe({
      next: (data: any) => {
        this.updateChartOptions(data);
      }
    });
  }

  onSymbolChange(changedValue: string) {
    this.candlePayload.symbol = changedValue;
    this.callCandleAPI();
  }

  onTimeFrameChange(timeFrame: labelValuePair) {
    this.selectedTimeSpan = timeFrame;
    this.candlePayload.timeFrame = timeFrame.value;
    this.callCandleAPI();
  }

}
