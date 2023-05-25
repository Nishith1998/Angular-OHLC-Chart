import { Component, ViewChild } from '@angular/core';
import { ChartDataService } from '../services/chart-data.service';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle } from 'ng-apexcharts';
import { map } from 'rxjs';
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
export class ChartComponent {

  @ViewChild("chart") chart: any;
  chartData: any;
  chartOptions: Partial<ChartOptions> | any;

  constructor(public chartDataService: ChartDataService, private wsService: WebsocketService) {
    console.log("this is chart component")
    
    let msg = JSON.stringify({ 
      event: 'subscribe', 
      channel: 'candles', 
      key: 'trade:1h:tBTCUSD' //'trade:TIMEFRAME:SYMBOL'
    });

    this.chartDataService.getCandles(msg)
    // .pipe(map((res: any) => {
    //   return {'asdf': 1}

    // }))
    .subscribe(data => {
      if (data) {
        console.log("data in chart comp: ", data)
        if(this.chartData) {
          this.updateSeries(data);
        } else {

        this.chartData = data;
        this.chartOptions = {
        //   colors: {
        //     ranges: [{
        //         from: 26400,
        //         to: 27200,
        //         color: '#dedede'
        //     }],
        // },
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
            type: "candlestick"
          },
          title: {
            text: "My First Angular Chart"
          },
          xaxis: {
            type: "datetime"
          },
          plotOptions: {
            candlestick: {
              colors: {
                upward: "red",
                downward: "yellow"
              },
              // wick: {
              //   useFillColor: true
              // }
            }
          }
        };
      }
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

  // public changeChartType() {
  //   this.chartOptions.chart.type = "candlestick";
  // }
}
