import { DataArray } from "../types/DataArray";

export interface queryBackendProps {
    route: string;
}

export const BASE_URL = 'http://127.0.0.1:8000';

export const queryBackend = async (route: string): Promise<DataArray> => {
    const requestURL = `${BASE_URL}/${route}`;
    const formData = new FormData();
    const data = await fetch(requestURL,
        {
            method: 'POST'
        }
    ).then(response => response.json()).then(d => d as DataArray);

    return data;
}


export default queryBackend;


