import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexPlotOptions, ApexTooltip } from "ng-apexcharts";

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