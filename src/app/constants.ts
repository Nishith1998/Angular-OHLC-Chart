import { TimeFrame } from "./models";

export const timeSpansList: TimeFrame[] = [
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
export const INITIAL_PAYLOAD_FOR_ORDERBOOK = {
    event: 'subscribe',
    channel: 'book',
    symbol: 'tBTCUSD'
};