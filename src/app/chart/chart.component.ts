import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataService } from '../services/chart-data.service';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle } from 'ng-apexcharts';
import { Observable, first, map, pipe } from 'rxjs';
import { WebsocketService } from '../services/websocket.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  @ViewChild("chart") chart: any;
  chartData: any;
  chartOptions: Partial<ChartOptions> | any;
  getAllSymbols$: Observable<any>;
  displayedColumns: any[] = ['name', 'last'];
  candlePayload: any = {
    symbol: ''
  };
  ohlcOnHover: { o: number; h: number; l: number; c: number; } | undefined;
  selectedSymbol!: string;

  constructor(private cdr: ChangeDetectorRef, public chartDataService: ChartDataService, private wsService: WebsocketService) {
    console.log("this is chart component")
    this.getAllSymbols$ = this.chartDataService.getAllSymbols();
    
    // let msg = { 
    //   symbol: 'tBTCUSD'
    //   // event: 'subscribe', 
    //   // channel: 'candles', 
    //   // key: 'trade:1h:tBTCUSD' //'trade:TIMEFRAME:SYMBOL'
    // };

  }

  ngOnInit() {
    this.getAllSymbols$.subscribe(data => {
      if(data) {
        this.selectedSymbol = data[0][0];
        this.candlePayload = {
          symbol: data[0][0],
          timeFrame: '1m'
        }
        this.callCandleAPI();
      }
    });

  }
  public updateSeries(data: any) {
    // debugger;
  //   this.chart.updateSeries([...this.chartOptions.series[0].data, {
  //     "x": "2023-05-25T08:52:00.000Z",
  //     "y": [6629.81, 6650.5, 6623.04, 6633.33]
  // }])
    this.chartOptions.series[0].data = [...this.chartOptions.series[0].data, data];
  let myData = this.chartOptions.series;
  this.chartOptions.series = [...myData];
    // this.chart.appendSeries(data);
    // this.chartOptions.series = [{
    //   data: [23, 44, 1, 22]
    // }];
  }

  // getTicker(value: any) {
  //   console.log("value: ", value);
  //   let msg = { 
  //     symbol: value[0],
  //     // event: 'subscribe', 
  //     // channel: 'candles', 
  //     // key: 'trade:1h:tBTCUSD' //'trade:TIMEFRAME:SYMBOL'
  //   };
  //   this.chartDataService.getCandles(msg).pipe(first()).subscribe((data:any) => {
  //     console.log("data: ", data)
  //     this.updateChartOptions(data);
  //   });
  //   // this.chartDataService.getCandles(msg);
  // }

  callCandleAPI() {
    this.chartDataService.getCandles(this.candlePayload).pipe(first()).subscribe((data:any) => {
      console.log("data: ", data)
      this.updateChartOptions(data);
    });
  }

  updateChartOptions(data: any) {
    this.chartData = data;
    this.chartOptions = {
      series: [
        //   {
        //   name: 'line',
        //   type: 'dashed',
        //   data: [2620]
        // },
        {
          name: "My-series",
          data: this.chartData
          // [            {
          //   x: new Date(1538778600000),
          //   y: [6629.81, 6650.5, 6623.04, 6633.33]
          // },]
        }
      ],
      chart: {
        height: 350,
        type: "candlestick",
        zoom: {
          enabled: true,
          type: 'x',
          autoScaleYaxis: true,
        }
      },
      // title: {
      //   text: "My First Angular Chart"
      // },
      xaxis: {
        type: "datetime"
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
        custom: ( {series, seriesIndex, dataPointIndex, w }:  {series: any, seriesIndex: any, dataPointIndex: any, w: any }) => {
          console.log("tooltip data: ", series,
          seriesIndex,
          dataPointIndex,
          w)
          this.ohlcOnHover = //w.globals.seriesCandleO[0][dataPointIndex];
          { o: w.globals.seriesCandleO[0][dataPointIndex],
            h: w.globals.seriesCandleH[0][dataPointIndex],
            l: w.globals.seriesCandleL[0][dataPointIndex],
            c: w.globals.seriesCandleC[0][dataPointIndex]
          };
          this.cdr.detectChanges();


          // return (
          //   '<div class="arrow_box">' +
          //   series[seriesIndex][dataPointIndex] +
          //   "</div>"
          // );
        }
      }
    };
  }

  // public changeChartType() {
  //   this.chartOptions.chart.type = "candlestick";
  // }
}
