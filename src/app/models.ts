export class labelValuePair {
    label!: string;
    value!: string;
}

export class tableDataType {
    symbol!: string;
    lastPrice!: number;

    // constructor(options: string[][] | number[][]) {
        // return options.map( ele => {
        //     return { symbol: ele[0], lastPrice: ele[1]}
        // })
    // }
    static mapToTableDataType(options: (string | number)[][]) {
        return options.map( (ele: (string | number)[]) => {
            return { symbol: ele[0], lastPrice: ele[1]}
        })
    }
}

export type chartDataType = {
    x: number;
    y: number[];
  }[];