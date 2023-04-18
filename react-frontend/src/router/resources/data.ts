import { DataArray, EmbeddingArray } from '../../types/data';
import axiosClient from '../apiClient'

/**
 * get the data points through a post request
 * @param id the identifier of the point array
*/
export function postPoints(id: string): Promise<DataArray | undefined> {
  const url = `data/mutag`
  const promise = axiosClient.get<DataArray>(url)
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
  const url = `data/embeddings`
  const promise = axiosClient.get<EmbeddingArray>(url)
  return promise
    .then((res) => {
      if(res.status !== 204) {
        return res.data;
      }
      return undefined;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}