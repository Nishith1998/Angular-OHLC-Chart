import { ChartComponent } from "./chart/chart.component";
import { ChartOptions, TimeFrame } from "./models";

export const URLs = {
    getCandles: 'api/getCandles',
    getAllSymbols: 'api/getAllSymbols',
    getOrderBook: 'wss://api-pub.bitfinex.com/ws/2'
}

export const ANGULAR_ROUTES = {
    HOME: '/home',
    ORDERBOOK: '/orderBook'
}

export const timeSpansList: TimeFrame[] = [
    // { label: '3y', value: '1W' },
    // { label: '1y', value: '1D' },
    // { label: '3m', value: '12h' },
    // { label: '1m', value: '6h' },
    { label: '7d', value: '1h' },
    { label: '3d', value: '30m' },
    { label: '1d', value: '15m' },
    { label: '6h', value: '5m' },
    { label: '1h', value: '1m' },
];
export const CHART_SERIES_NAME = 'candle';
export const QUERY_PARAM_SYMBOL = 'symbol';
export const INITIAL_INDEX_FOR_CHART = 0;
export const INITIAL_TIME_FRAME_FOR_CHART = '1m';
export const INITIAL_PAYLOAD_FOR_ORDERBOOK = {
    event: 'subscribe',
    channel: 'book',
    symbol: 'tBTCUSD'
};

export const getChartOptions = function (this: ChartComponent): ChartOptions {
    return {
        series: [
            {
              name: CHART_SERIES_NAME,
              data: this.chartData
            }
          ],
        chart: {
            events: {
                zoomed: () => {
                    this.selectedTimeFrame = null;
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
                formatter: function (val: string) {
                    // console.log("formatter value: ", val)
                    let date = new Date(val);
                    return date.toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric' }) + ' ' + date.toLocaleTimeString().substring(0, 5);
                }
            }
        },
        yaxis: {
            labels: {
                formatter: function (val: number) {
                    return val.toFixed(2);
                }
            }
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: "black",
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
            custom: ({ series, seriesIndex, dataPointIndex, w }: { series: number[][], seriesIndex: number, dataPointIndex: number, w: {config: any, globals: any} }) => {
                // console.log("tooltip data: ", series,
                //     seriesIndex,
                //     dataPointIndex,
                //     w)
                this.ohlcOnHover =
                {
                    o: w.globals.seriesCandleO[0][dataPointIndex],
                    h: w.globals.seriesCandleH[0][dataPointIndex],
                    l: w.globals.seriesCandleL[0][dataPointIndex],
                    c: w.globals.seriesCandleC[0][dataPointIndex]
                };
                this.changeDetectorRef.detectChanges();
            }
        }
    }
}