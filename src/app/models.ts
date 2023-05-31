import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexPlotOptions, ApexTooltip } from "ng-apexcharts";
import { ChartComponent } from "./chart/chart.component";

export type ChartOptions = {
    series?: ApexAxisChartSeries;
    chart?: ApexChart;
    xaxis?: ApexXAxis;
    yaxis?: ApexYAxis;
    plotOptions?: ApexPlotOptions;
    tooltip?: ApexTooltip;
};

export type TimeFrame = {
    label: string;
    value: string;
}

const INDEX_OF_SYMBOL = 0;
const INDEX_OF_LASTPRICE = 1;
export class TableDataType {
    symbol: string;
    lastPrice: number;

    static mapToTableDataType(options: GetAllSymbolsResp[]): TableDataType[] {
        return options.map((ele: GetAllSymbolsResp) => {
            return { symbol: ele[INDEX_OF_SYMBOL], lastPrice: ele[INDEX_OF_LASTPRICE] }
        })
    }
}

export type ChartDataType = {
    x: number;
    y: [number, number, number, number];
}[];

export type ChartPayload = {
    symbol: string;
    timeFrame: string;
};

export type OrderBookPayload = {
    event: string;
    channel: string;
    symbol: string;
};

export type UpdatedValuesFromWs = [number, number, number];

export const isUpdatedValuesFromWs = (x: any): x is UpdatedValuesFromWs => x.length == 3 &&
    typeof x[0] == 'number' &&
    typeof x[1] == 'number' &&
    typeof x[1] == 'number';

export type GetAllSymbolsResp = [string, number, number, number, number, number, number, number, number, number, number];

export const getChartOptions = function(this: ChartComponent): ChartOptions {
    // if (this != undefined) {
        return {
            chart: {
                events: {
                    zoomed: (chartContext: any, { xaxis, yaxis }: { xaxis: any, yaxis: any }) => {
                        this.selectedTimeSpan = null;
                        // console.log("zoomed", chartContext, xaxis, yaxis);
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
            yaxis: {
                labels: {
                    formatter: function (val, index) {
                        return val.toFixed(2);
                    }
                }
            },
            plotOptions: {
                candlestick: {
                    colors: {
                        upward: "yellow",
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
        }
    // }
    // else
    //     return
}