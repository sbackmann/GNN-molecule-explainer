export interface DataPoint {
    x: number[][];
    edge_index: number[][];
    y: number[];
    idx: number[];
    edge_attr: number[];
    adj_padded: number[][];
    x_padded: number[][];
}
export interface EmbeddingPoint {
    idx: number;
    pca_x: number;
    pca_y: number;
    true_label: string;
}

export type DataArray = DataPoint[];
export type EmbeddingArray = EmbeddingPoint[];