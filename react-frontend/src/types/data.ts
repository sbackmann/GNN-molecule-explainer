export interface DataPoint {
    x: number[][];
    edge_index: number[][];
    y: number[];
    idx: number[];
    edge_attr: number[];
    adj_padded: number[][];
    x_padded: number[][];
}

export type DataArray = DataPoint[];