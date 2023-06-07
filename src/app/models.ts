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

export class TableDataType {
    symbol: string;
    lastPrice?: number;
    unit: string;
    // symbolValue: string; // remove

    // format is wrong, from and to
    // tableDataType name is general

    static mapToTableDataType(options: GetAllSymbolsResp[]): TableDataType[] {
        const tickersdataMap = new Map(); // const for ansArr, name for dataMap & ansArr
        options.forEach(ele => {
            const key = ele[INDEX_OF_SYMBOL].substring(1,4);
            const unit = ele[INDEX_OF_SYMBOL].substring(4,).replace(':', '').replace('F0', '').replace('F0', '')
            if(tickersdataMap.has(key)) {
                if(ele[INDEX_OF_SYMBOL].length > 4)
                tickersdataMap.get(key).push({symbol: ele[INDEX_OF_SYMBOL], lastPrice: ele[INDEX_OF_LASTPRICE], unit: unit})
            } else {
                tickersdataMap.set(key, [{symbol: ele[INDEX_OF_SYMBOL], lastPrice: ele[INDEX_OF_LASTPRICE], unit: unit}])
            }
        });
        const tickerTableMergedArr: TableDataType[] = [];
        tickersdataMap.forEach(ele => {
            tickerTableMergedArr.push(...ele)
        })
        return tickerTableMergedArr;
        // return options.map((ele: GetAllSymbolsResp) => {
        //     return { symbol: ele[INDEX_OF_SYMBOL], lastPrice: ele[INDEX_OF_LASTPRICE] }
        // });

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

export const isUpdatedValuesFromWs = (x: any): x is UpdatedValuesFromWs => x && x.length == 3 &&
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