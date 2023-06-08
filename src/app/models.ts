import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexPlotOptions, ApexTooltip } from "ng-apexcharts";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    plotOptions: ApexPlotOptions;
    tooltip: ApexTooltip;
};

export type TimeFrame = {
    label: string;
    value: string;
}

const INDEX_OF_SYMBOL = 0;
const INDEX_OF_LASTPRICE = 1;
const INDEX_OF_EPOCHTIME = 0;
const INDEX_OF_OPENVALUE = 1;
const INDEX_OF_HIGHVALUE = 2;
const INDEX_OF_CLOSEVALUE = 3;
const INDEX_OF_LOWVALUE = 4;
const SYMBOL_SUBSTRING_MIN_INDEX = 1;
const SYMBOL_SUBSTRING_MAX_INDEX = 4;

export class TickersTableDataType {
    tickerSymbol: string;
    tickerName: string;
    tickerUnit: string;
    tickerLastPrice: number;

    static mapToTickersTableDataType(options: GetAllSymbolsResp[]): TickersTableDataType[] {
        const tickersdataMap: Map<string, TickersTableDataType[]> = new Map();
        options.forEach(ele => {
            const key = ele[INDEX_OF_SYMBOL].substring(SYMBOL_SUBSTRING_MIN_INDEX, SYMBOL_SUBSTRING_MAX_INDEX);
            const unit = ele[INDEX_OF_SYMBOL].substring(SYMBOL_SUBSTRING_MAX_INDEX,).replace(':', '').replace('F0', '').replace('F0', '')
            if (tickersdataMap.has(key)) {
                if (ele[INDEX_OF_SYMBOL].length > SYMBOL_SUBSTRING_MAX_INDEX)
                    tickersdataMap.get(key)?.push({ tickerSymbol: ele[INDEX_OF_SYMBOL], tickerLastPrice: ele[INDEX_OF_LASTPRICE], tickerUnit: unit, tickerName: key })
            } else {
                tickersdataMap.set(key, [{ tickerSymbol: ele[INDEX_OF_SYMBOL], tickerLastPrice: ele[INDEX_OF_LASTPRICE], tickerUnit: unit, tickerName: key }])
            }
        });
        const tickerTableMergedArr: TickersTableDataType[] = [];
        tickersdataMap.forEach(ele => {
            tickerTableMergedArr.push(...ele)
        })
        return tickerTableMergedArr;

    }
}

export type ChartDataType = {
    x: number;
    y: [number, number, number, number];
};

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

export const isUpdatedValuesFromWs = (x: unknown[]): x is UpdatedValuesFromWs => x && x.length == 3 &&
    typeof x[0] == 'number' &&
    typeof x[1] == 'number' &&
    typeof x[1] == 'number';

export type GetAllSymbolsResp = [string, number, number, number, number, number, number, number, number, number, number];

export type getCandleList = [number, number, number, number, number, number]
export type getCandleResp = getCandleList[];

export const candleMapping = (data: getCandleResp): ChartDataType[] => {
    return data.map((ele: getCandleList): ChartDataType => {
        return {
            x: ele[INDEX_OF_EPOCHTIME],
            y: [
                ele[INDEX_OF_OPENVALUE],
                ele[INDEX_OF_HIGHVALUE],
                ele[INDEX_OF_CLOSEVALUE],
                ele[INDEX_OF_LOWVALUE]
            ]
        }
    })
}