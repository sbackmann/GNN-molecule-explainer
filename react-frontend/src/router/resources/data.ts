import { DataArray, EmbeddingArray } from "../../types/data";
import axiosClient from "../apiClient";

/**
 * get the data points through a post request
 * @param id the identifier of the point array
 */
export function postPoints(): Promise<DataArray | undefined> {
  const url = `data/mutag`;
  const promise = axiosClient.get<DataArray>(url);
  return promise
    .then((res) => {
      if (res.status !== 204) {
        return res.data;
      }
      return undefined;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}
export function postEmbeddings(): Promise<EmbeddingArray | undefined> {
  const url = `data/embeddings`;
  const promise = axiosClient.get<EmbeddingArray>(url);
  return promise
    .then((res) => {
      if (res.status !== 204) {
        return res.data;
      }
      return undefined;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

export function postExplanations(explainer: string,
                                 focus: string,
                                 idx: string,
                                 mask_nature: string,
                                 mask_transformation: string,
                                 level: string): Promise<number[] | undefined> {
  const url = `data/${explainer}_${focus}_${idx}_${mask_nature}_${mask_transformation}_${level}`;
  const promise = axiosClient.get<number[]>(url);
  return promise
    .then((res) => {
      if (res.status !== 204) {
        return res.data;
      }
      return undefined;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}
