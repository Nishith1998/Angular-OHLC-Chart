import { labelValuePair } from "./models";

export const timeSpansList: labelValuePair[] = [
    { label: '3y', value: '1W' },
    { label: '1y', value: '1D' },
    { label: '3m', value: '12h' },
    { label: '1m', value: '6h' },
    { label: '7d', value: '1h' },
    { label: '3d', value: '30m' },
    { label: '1d', value: '15m' },
    { label: '6h', value: '5m' },
    { label: '1h', value: '1m' },
];

export const INITIAL_INDEX_FOR_CHART = 0;
export const INITIAL_TIME_FRAME_FOR_CHART = '1m';

// export const chartOptions =  {
//     chart: {
//       events: {
//         zoomed: (chartContext: any, { xaxis, yaxis }: { xaxis: any, yaxis: any }) => {
//           this.selectedTimeSpan = null;
//           console.log("zoomed", chartContext, xaxis, yaxis);
//         }
//       },
//       height: 350,
//       type: "candlestick",
//       zoom: {
//         enabled: true,
//         type: 'x',
//         autoScaleYaxis: true,
//       }
//     },
//     xaxis: {
//       type: "datetime",
//       tooltip: {
//         formatter: function (val: any) {
//           // console.log("formatter value: ", val)
//           let date = new Date(val);
//           return date.toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric' }) + ' ' + date.toLocaleTimeString().substring(0, 5);
//         }
//       }
//     },
//     plotOptions: {
//       candlestick: {
//         colors: {
//           upward: "green",
//           downward: "red"
//         },
//         wick: {
//           useFillColor: true
//         }
//       }
//     },
//     tooltip: {
//       enabled: true,
//       cssClass: "my-tooltip",
//       custom: ({ series, seriesIndex, dataPointIndex, w }: { series: any, seriesIndex: any, dataPointIndex: any, w: any }) => {
//         console.log("tooltip data: ", series,
//           seriesIndex,
//           dataPointIndex,
//           w)
//         this.ohlcOnHover =
//         {
//           o: w.globals.seriesCandleO[0][dataPointIndex],
//           h: w.globals.seriesCandleH[0][dataPointIndex],
//           l: w.globals.seriesCandleL[0][dataPointIndex],
//           c: w.globals.seriesCandleC[0][dataPointIndex]
//         };
//         this.cdr.detectChanges();
//       }
//     }
//   }