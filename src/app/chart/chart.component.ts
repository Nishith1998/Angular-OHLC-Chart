import { Component } from '@angular/core';
import { ChartDataService } from '../services/chart-data.service';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle } from 'ng-apexcharts';
import { map } from 'rxjs';

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

  chartData: any;
  chartOptions: Partial<ChartOptions> | any;

  constructor(public chartDataService: ChartDataService) {
    console.log("this is chart component")
    this.chartDataService.getCandles()
    // .pipe(map((res: any) => {
    //   return {'asdf': 1}

    // }))
    .subscribe(data => {
      if (data) {
        console.log("data: ", data)
        this.chartData = data;

        this.chartOptions = {
          series: [
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
          // xaxis: {
          //   categories: ["Jan", "Feb",  "Mar",  "Apr",  "May",  "Jun",  "Jul",  "Aug", "Sep"]
          // }
        };
      }
    });
  }

  public updateSeries() {
    this.chartOptions.series = [{
      data: [23, 44, 1, 22]
    }];
  }

  public changeChartType() {
    this.chartOptions.chart.type = "candlestick";
  }
}
